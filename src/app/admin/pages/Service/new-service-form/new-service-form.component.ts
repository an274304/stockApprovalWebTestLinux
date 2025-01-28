import { Component, inject, OnDestroy } from '@angular/core';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { ProductMaster } from '../../../../core/Models/ProductMaster';
import { CategoryMaster } from '../../../../core/Models/CategoryMaster';
import { CategoryMngService } from '../../../services/category-mng.service';
import { ProductMngService } from '../../../services/product-mng.service';
import { VendorMngService } from '../../../services/vendor-mng.service';
import { CurrencyMngService } from '../../../services/currency-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceOrder } from '../../../../core/Models/ServiceOrder';
import { ServiceItem } from '../../../../core/Models/ServiceItem';
import { ServiceMngService } from '../../../services/service-mng.service';
import { ServiceOrderWithItemAndImage } from '../../../../core/DTOs/ServiceOrderWithItemAndImage';
import { ServiceItemWithImage } from '../../../../core/DTOs/ServiceItemWithImage';
import { ServiceItemPictureType } from '../../../../core/DTOs/ServiceItemPictureType';
declare var $: any;

@Component({
  selector: 'app-new-service-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-service-form.component.html',
  styleUrl: './new-service-form.component.css'
})
export class NewServiceFormComponent implements OnDestroy {
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
  itemImages: File[] = []; // Array to hold image files
  imagePreviews: string[] = []; // Array for object URLs
  hoveredImage: string | null = null;

  currency: string = '1';
  serviceOrderNo: string = '';
  serviceOrderRemark: string = '';
  serviceOrderDt: string = new Date().toISOString().split('T')[0];
  serviceDeliveryDt: string = new Date().toISOString().split('T')[0];
  // Array to hold the mapped PurchaseItem objects
  serviceItemsWithImage: ServiceItemWithImage[] = [];

  filteredCategories: CategoryMaster[] = [];
  filteredProducts: ProductMaster[] = [];
  filteredVendors: VendorMaster[] = [];
  filteredCurrency: CurrencyMaster[] = [];

  private serviceMng = inject(ServiceMngService);
  private categoryService = inject(CategoryMngService);
  private productService = inject(ProductMngService);
  private vendorService = inject(VendorMngService);
  private currencyService = inject(CurrencyMngService);
  private sweetAlert = inject(SweetAlertService);

  serviceOrderSaveApi: ServiceOrder | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadCurrency();
    this.loadVendors();
  }

  // Lifecycle hook to release memory
  ngOnDestroy(): void {
    this.imagePreviews.forEach(url => URL.revokeObjectURL(url));
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
    this.mapTableItemsToServiceItems();

    if (this.currency == '' || this.currency == null || this.currency == undefined) {
      this.sweetAlert.toast('Select Currency !!!', 'warning');
      return;
    }

    if (this.serviceItemsWithImage.length <= 0) {
      this.sweetAlert.toast('Add Items !!!', 'warning');
      return;
    }


    const newOrder = new ServiceOrder({
      serviceOrderDt: new Date(this.serviceOrderDt),
      serviceExpDelDt: new Date(this.serviceDeliveryDt),
      serviceCurrency: this.currency,
      serviceRemark: this.serviceOrderRemark
    });

    // Initialize ServiceOrderWitItems
    const orderWithItemAndImage = new ServiceOrderWithItemAndImage({
      serviceOrder: newOrder,
      serviceItemWithImages: this.serviceItemsWithImage
    });

    const formData = new FormData();
    
    // Append ServiceOrder data, using nullish coalescing to handle undefined cases
    formData.append("serviceOrder.serviceOrderDt", newOrder.serviceOrderDt?.toISOString() ?? '');
    formData.append("serviceOrder.serviceExpDelDt", newOrder.serviceExpDelDt?.toISOString() ?? '');
    formData.append("serviceOrder.serviceCurrency", newOrder.serviceCurrency ?? '');
    formData.append("serviceOrder.serviceRemark", newOrder.serviceRemark ?? '');

    // Append service items with images
    orderWithItemAndImage.serviceItemWithImages?.forEach((itemWithImage, index) => {
        formData.append(`serviceItemWithImages[${index}].serviceItem.catId`, itemWithImage.serviceItem?.catId?.toString() ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.catName`, itemWithImage.serviceItem?.catName ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.proId`, itemWithImage.serviceItem?.proId?.toString() ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.proName`, itemWithImage.serviceItem?.proName ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.venId`, itemWithImage.serviceItem?.venId?.toString() ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.venName`, itemWithImage.serviceItem?.venName ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.itemRemark`, itemWithImage.serviceItem?.itemRemark ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.itemRate`, itemWithImage.serviceItem?.itemRate?.toString() ?? '');
        formData.append(`serviceItemWithImages[${index}].serviceItem.itemQty`, itemWithImage.serviceItem?.itemQty?.toString() ?? '');

        // Append images
        itemWithImage.serviceItemPictures?.forEach((picture, picIndex) => {
            formData.append(`serviceItemWithImages[${index}].serviceItemPictures[${picIndex}].proId`, picture.proId?.toString() ?? '');
            formData.append(`serviceItemWithImages[${index}].serviceItemPictures[${picIndex}].picture`, picture.picture ?? new File([], ""));
        });
    });

    this.serviceMng.serviceOrder(formData).subscribe({
      next: (response: ApiResult<string>) => {
        if (response.result) {
          // this.serviceOrderSaveApi = response.data ?? null;
          this.serviceOrderNo = response.data ?? 'Null';
          this.sweetAlert.message(`Save Successfully.. Check Your Order No. ${this.serviceOrderNo}`, 'success');
        }
        else {
          this.sweetAlert.toast('Fail To Save', 'warning');
        }

      },
      error: (err: any) => {
        console.error('Error fetching Users', err);
      }
    });
  }

  // Method to map tableItems to PurchaseItem
  mapTableItemsToServiceItems() {

    this.serviceItemsWithImage = this.tableItems.map(item => new ServiceItemWithImage(
      {
        serviceItem: new ServiceItem({
          catId: item.catId,
          catName: item.catName,
          proId: item.proId,
          proName: item.proName,
          venId: item.venId,
          venName: item.venName,
          itemRemark: item.itemRemark,
          itemRate: item.itemRate,
          itemQty: item.itemQty
        }),
        serviceItemPictures: item.itemImages.map(images => new ServiceItemPictureType(
          {
            proId: item.proId,
            picture: images
          }
        ))
      }
    ));
  }

  //#endregion Form submit



  //#region - Table Logics

  // Array to hold the table data, including multiple images per row
  tableItems: Array<{
    catId: number;
    catName: string;
    proId: number;
    proName: string;
    venId: number;
    venName: string;
    itemRemark: string;
    itemRate: number;
    itemQty: number;
    total: number;
    itemImages: File[]; // Array to hold multiple images
    itemPreviews: string[]; // Array to hold multiple previews
  }> = [];

  // Variable to hold the total amount
  totalAmount: number = 0;

  // Method to add a new row
  addRow() {

    if (this.catId == 0 || this.proId == 0 || this.venId == 0 || this.itemRate == 0 || this.itemQty == 0 || this.amount == 0) {
      this.sweetAlert.toast('Something Went Wrong !!!', 'error');
      return;
    }

    if(this.imagePreviews.length <= 0){
      this.sweetAlert.toast('Select Any Image', 'warning');
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
      itemRemark: this.itemRemark,
      itemRate: this.itemRate,
      itemQty: this.itemQty,
      total: this.amount,
      itemImages: this.itemImages,
      itemPreviews : this.imagePreviews
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
    this.itemImages = [];
    this.imagePreviews = [];

    // Explicitly Set Null For New Product Select
    $('#product-select').val(null).trigger('change');
  }

  // Method to remove a row
  removeRow(index: number) {
    this.tableItems.splice(index, 1); // Remove the item at the specified index
    this.updateTotal(); // Update the total amount after removing the row
  }

  calculateAmount() {
    this.amount = this.itemRate * this.itemQty;
  }

  
  // Method to handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);
      const validFiles: File[] = [];
      const maxSize = 500 * 1024; // 500 KB in bytes
      const maxFiles = 4; // Maximum number of files

      files.forEach(file => {
        // Check file type
        if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
          // Check file size
          if (file.size <= maxSize) {
            if (validFiles.length < maxFiles) { // Check for maximum number of files
              validFiles.push(file);
            } else {
              this.sweetAlert.toast(`You can only upload a maximum of ${maxFiles} files.`, 'warning');
            }
          } else {
            this.sweetAlert.toast(`File ${file.name} exceeds the size limit of 500 KB.`, 'error');
          }
        } else {
          this.sweetAlert.toast(`File ${file.name} is not a valid image type. Please upload PNG or JPG or JPEG files.`, 'error');
        }
      });

      this.itemImages = validFiles; // Update valid images
      this.imagePreviews = this.itemImages.map(file => URL.createObjectURL(file));
    }
  }

  // Method to handle category change event
  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.catName = selectedOption.text;
    this.catId = parseInt(selectedOption.value);

    this.loadProductes(this.catId);
    this.loadVendors();
    //this.loadVendors(this.catId);
  }


  // Method to handle product change event
  onProductChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.proName = selectedOption.text;
    this.proId = parseInt(selectedOption.value);
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
      error: (err: any) => {
        console.error('Error fetching categories', err);
        this.catListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
        this.filteredCategories = [];
      }
    });
  }

  private loadProductes(catId: number): void {
    this.productService.getAllProductByCatID(catId).subscribe({
      next: (response: ApiResult<ProductMaster>) => {
        this.productListApiResult = response;
        this.filteredProducts = response.dataList ?? [];
      },
      error: (err: any) => {
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
      error: (err: any) => {
        console.error('Error fetching vendors', err);
        this.vendorListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredVendors = [];
      }
    });
  }

  private loadVendorByCatId(catId: number): void {
    this.vendorService.getAllVendorByCatId(catId).subscribe({
      next: (response: ApiResult<VendorMaster>) => {
        this.vendorListApiResult = response;
        this.filteredVendors = response.dataList ?? [];
      },
      error: (err: any) => {
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
      error: (err: any) => {
        console.error('Error fetching vendors', err);
        this.currencyListApiResult = { dataList: [], result: false, message: 'Error fetching vendors' };
        this.filteredCurrency = [];
      }
    });
  }
  //#endregion Bind Drop Downs
}
