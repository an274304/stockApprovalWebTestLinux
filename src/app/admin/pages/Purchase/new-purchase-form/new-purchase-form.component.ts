import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderWitItems } from '../../../../core/DTOs/PurchaseOrderWitItems';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
import { PurchaseMngService } from '../../../services/purchase-mng.service';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CategoryMaster } from '../../../../core/Models/CategoryMaster';
import { CategoryMngService } from '../../../services/category-mng.service';
import { ProductMngService } from '../../../services/product-mng.service';
import { ProductMaster } from '../../../../core/Models/ProductMaster';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { VendorMngService } from '../../../services/vendor-mng.service';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { CurrencyMngService } from '../../../services/currency-mng.service';

import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

declare var $ : any;

@Component({
  selector: 'app-new-purchase-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-purchase-form.component.html',
  styleUrls: ['./new-purchase-form.component.css']
})
export class NewPurchaseFormComponent implements OnInit, AfterViewInit {


  catListApiResult: ApiResult<CategoryMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  productListApiResult: ApiResult<ProductMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorListApiResult: ApiResult<VendorMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  currencyListApiResult: ApiResult<CurrencyMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  // Properties bound to form inputs
  catId: number = 0;
  catName: string = '';
  proId: number = 0;
  proName: string = '';
  venId: number = 0;
  venName: string = '';
  itemName: string = '';
  itemRemark: string = '';
  itemRate: number = 0;
  itemQty: number = 0;
  amount: number = 0;
  gstPercentage: number = 18;

  currency: string = '1';
  purchaseOrderNo: string = '';
  purchaseOrderRemark: string = '';
  purchaseOrderDt: string = new Date().toISOString().split('T')[0];
  purchaseDeliveryDt: string = new Date().toISOString().split('T')[0];
  // Array to hold the mapped PurchaseItem objects
  purchaseItems: PurchaseItem[] = [];

  filteredCategories: CategoryMaster[] = [];
  filteredProducts: ProductMaster[] = [];
  filteredVendors: VendorMaster[] = [];
  filteredCurrency: CurrencyMaster[] = [];

  private purchaseService = inject(PurchaseMngService);
  private categoryService = inject(CategoryMngService);
  private productService = inject(ProductMngService);
  private vendorService = inject(VendorMngService);
  private currencyService = inject(CurrencyMngService);
  private sweetAlert  = inject(SweetAlertService);

  purchaseOrderSaveApi: PurchaseOrder | null = null;

  ngOnInit(): void {
    this.loadCategories();
    // this.loadProductes();
     this.loadVendors();
    this.loadCurrency();
  }

  ngAfterViewInit(): void {
    
      setTimeout(() => {
  
        // Initialize Select2 for Category dropdown
        $('#category-select').select2({
          theme: "bootstrap-5",
          width: '100%',
          placeholder: 'Choose one Category',
          allowClear: true
        }).on('change', (event: any) => { // Use 'any' for the event
          this.onCategoryChange(event);
        });
  
        // Initialize Select2 for Product dropdown
        $('#product-select').select2({
          theme: "bootstrap-5",
          width: '100%',
          placeholder: 'Choose one Product',
          allowClear: true
        }).on('change', (event: any) => {
          this.onProductChange(event);
        }).on('select2:clearing', () => {
        });

        // Initialize Select2 for Vendor dropdown
        $('#vendor-select').select2({
          theme: "bootstrap-5",
          width: '100%',
          placeholder: 'Choose one Vendor',
          allowClear: true
        }).on('change', (event: any) => {
          this.onVendorChange(event);
        }).on('select2:clearing', () => {
        });
  
      });
   
  }

  //#region Form submit
  onFormSubmit() {
    this.mapTableItemsToPurchaseItems();

    if (this.currency == '' || this.currency == null || this.currency == undefined) {
      this.sweetAlert.toast('Select Currency !!!', 'warning');
      return;
    }

    if (this.purchaseItems.length <= 0) {
      this.sweetAlert.toast('Add Items !!!', 'warning');
      return;
    }


      const newOrder = new PurchaseOrder({
        purchaseOrderDt: new Date(this.purchaseOrderDt),
        purchaseExpDelDt: new Date(this.purchaseDeliveryDt),
        purchaseCurrency: this.currency,
        purchaseRemark: this.purchaseOrderRemark,
        created: new Date(new Date().toISOString()),
        createdBy: 'valueFromSession'
      });

      // Initialize PurchaseOrderWitItems
      const orderWithItems = new PurchaseOrderWitItems({
        purchaseOrder: newOrder,
        purchaseItems: this.purchaseItems
      });


      this.purchaseService.purchaseOrder(orderWithItems).subscribe({
        next: (response: ApiResult<PurchaseOrder>) => {
          if (response.result) {
            this.purchaseOrderSaveApi = response.data ?? null;
            this.purchaseOrderNo = this.purchaseOrderSaveApi?.purchaseOrderNo ?? '';
            this.sweetAlert.message('Save Successfully.. Check Your Order No.', 'success');
          }
          else {
            this.sweetAlert.toast('Fail To Save', 'warning');
          }

        },
        error: (err) => {
          console.error('Error fetching Users', err);
        }
      });
  }

  // Method to map tableItems to PurchaseItem
  mapTableItemsToPurchaseItems() {
    this.purchaseItems = this.tableItems.map(item => new PurchaseItem({
      catId: item.catId,
      catName: item.catName,
      proId: item.proId,
      proName: item.proName,
      venId: item.venId,
      venName: item.venName,
      itemName: item.itemName,
      itemRemark: item.itemRemark,
      itemRate: item.itemRate,
      itemQty: item.itemQty
    }));
  }

  //#endregion Form submit



  //#region - Table Logics

  // Array to hold the table data
  tableItems: Array<{
    catId: number;
    catName: string;
    proId: number;
    proName: string;
    venId: number;
    venName: string;
    itemName: string;
    itemRemark: string;
    itemRate: number;
    itemQty: number;
    total: number
  }> = [];

  // Variable to hold the total amount
  totalAmount: number = 0;

  // Method to add a new row
  addRow() {

    if (this.catId == 0 || this.proId == 0 || this.venId == 0 || this.itemRate == 0 || this.itemQty == 0 || this.amount == 0) {
      this.sweetAlert.toast('Something Went Wrong !!!', 'error');
      return;
    }

    // Create a new item with the values from the form
    const newItem = {
      catId: this.catId,
      catName: this.catName,
      proId: this.proId,
      proName: this.proName,
      venId: this.venId,
      venName: this.venName,
      itemName: this.itemName,
      itemRemark: this.itemRemark,
      itemRate: this.itemRate,
      itemQty: this.itemQty,
      total: this.amount
    };

    // Add the new item to the table
    this.tableItems.push(newItem);

    // Update the total amount
    this.updateTotal();

    // Clear form fields
    this.clearForm();

    // Focus To Select For Product 
    $('#category-select').focus();
  }

  // Method to update the total amount
  updateTotal() {
    this.totalAmount = this.tableItems.reduce((sum, item) => sum + item.total, 0);
  }

  // Method to clear form fields
  clearForm() {
   // this.catId = 0;
    this.proId = 0;
   // this.venId = 0;
    this.itemRate = 0;
    this.itemQty = 0;
    this.amount = 0;
    this.itemRemark = '';

    // Explicitly Set Null For New Product Select
    $('#product-select').val(null).trigger('change');
  }

  // Method to remove a row
  removeRow(index: number) {
    this.tableItems.splice(index, 1); // Remove the item at the specified index
    this.updateTotal(); // Update the total amount after removing the row
  }

  calculateAmount() {
    const totalValue = this.itemRate * this.itemQty;
    const gstValue = this.itemRate * this.gstPercentage/100;
    const totalGstValue = gstValue * this.itemQty;
    this.amount = Math.round((totalValue + totalGstValue) * 10) / 10; 
  }

  // Method to handle category change event
  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.catName = selectedOption.text;
    this.catId = parseInt(selectedOption.value);

    this.loadProductes(this.catId);
    this.loadVendors();
  }


  // Method to handle product change event
  onProductChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.proName = selectedOption.text;
    this.proId = parseInt(selectedOption.value);

    this.getLastRateOfProductUsingProId(this.proId);
  }

  // Method to handle vendor change event
  onVendorChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.venName = selectedOption.text;
    this.venId = parseInt(selectedOption.value);
  }

  // Method to handle currency change event
  onCurrencyChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.currency = selectedOption.text;
  }
  //#endregion

  //#region Bind Drop Downs
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: ApiResult<CategoryMaster>) => {
        this.catListApiResult = response;
        this.filteredCategories = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.catListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
        this.filteredCategories = [];
      }
    });
  }

  private loadProductes(catId : number): void {
    this.productService.getAllProductByCatID(catId).subscribe({
      next: (response: ApiResult<ProductMaster>) => {
        this.productListApiResult = response;
        this.filteredProducts = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.productListApiResult = { dataList: [], result: false, message: 'Error fetching products' };
        this.filteredProducts = [];
      }
    });
  }

  private loadVendors(): void {
    this.vendorService.getVendors().subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        this.vendorListApiResult = response;
        this.filteredVendors = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching vendors', err);
        this.vendorListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredVendors = [];
      }
    });
  }

  private loadVendorsByCatId(catId : number): void {
    this.vendorService.getAllVendorByCatId(catId).subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        this.vendorListApiResult = response;
        this.filteredVendors = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching vendors', err);
        this.vendorListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredVendors = [];
      }
    });
  }

  private loadCurrency(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (response: ApiResult<CurrencyMaster>) => {
        this.currencyListApiResult = response;
        this.filteredCurrency = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching vendors', err);
        this.currencyListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredCurrency = [];
      }
    });
  }

  private getLastRateOfProductUsingProId(proId : number){
    this.productService.getLastRateOfProductUsingProId(proId).subscribe({
      next: (response: ApiResult<number>) => {
            if(response.result){
                this.itemRate = response.data ?? 0;
            }
            else{
              this.itemRate = 0;
              this.sweetAlert.toast('Failed To Get Last Rate Of Product', 'error');
            }
      },
      error: (err) => {
        console.error('Error fetching Last Rate Of Product', err);
        this.currencyListApiResult = { dataList: [], result: false, message: 'Error fetching Last Rate Of Product' };
        this.filteredCurrency = [];
      }
    });
  }
  //#endregion Bind Drop Downs
}
