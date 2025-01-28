import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderWitItems } from '../../../../core/DTOs/PurchaseOrderWitItems';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { PurchaseMngService } from '../../../services/purchase-mng.service';
import { CurrencyMngService } from '../../../services/currency-mng.service';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
declare var $: any;

@Component({
  selector: 'app-view-received-items-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-received-items-form.component.html',
  styleUrl: './view-received-items-form.component.css'
})
export class ViewReceivedItemsFormComponent implements OnInit {
  purchaseOrderNo_FromQuery: string | null = null;
  @ViewChild('billInputFile') billInputFile: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('receiptInputFile') receiptInputFile: ElementRef<HTMLInputElement> | null = null;
  
  isAlreadyPaid : boolean = false;
  hoveredImage: string | null = null;

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

  currency: string = '';
  purchaseOrderNo: string = '';
  purchaseOrderRemark: string = '';
  purchaseOrderVendorBillPath: string = '';
  purchaseOrderDt: string = '';
  purchaseDeliveryDt: string = '';
  adminReceiveMess: string = '';
  isFromAdminToStock: boolean = false;

  // Variable to hold the total amount
  totalAmount: number = 0;

  // Array to hold the mapped PurchaseItem objects
  purchaseItems: PurchaseItem[] = [];
  filteredCurrencies: CurrencyMaster[] = [];

  // Array to hold the table data
  tableItems: Array<{
    id: number;
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

  formDataApiResult: ApiResult<PurchaseOrderWitItems> = { data: undefined, result: false, message: 'Connection Not Available.' };
  forUpdateItems? : PurchaseOrderWitItems;

  currencyListApiResult: ApiResult<CurrencyMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  constructor(private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseMngService,
    private currencyService: CurrencyMngService,
    private sweetAlert : SweetAlertService) {
  }

  ngOnInit(): void {
    this.reloadTableData();
  }

  GetReceivedItemsForUpdate(purchaseOrderNo: string) {
    this.purchaseService.GetReceivedItemsForUpdate(purchaseOrderNo).subscribe({
      next: (response: ApiResult<PurchaseOrderWitItems>) => {
        if (response.result) {
          this.formDataApiResult = response ?? null;

          this.purchaseOrderNo = this.formDataApiResult.data?.purchaseOrder?.purchaseOrderNo ?? '';
          this.purchaseOrderDt = this.formDataApiResult.data?.purchaseOrder?.purchaseOrderDt
            ? this.formatDate(this.formDataApiResult.data.purchaseOrder.purchaseOrderDt)
            : '';

          this.purchaseDeliveryDt = this.formDataApiResult.data?.purchaseOrder?.purchaseExpDelDt
            ? this.formatDate(this.formDataApiResult.data.purchaseOrder.purchaseExpDelDt)
            : '';

          this.purchaseOrderRemark = this.formDataApiResult.data?.purchaseOrder?.purchaseRemark ?? '';
          //this.currency = this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency ?? '';
          this.currency = this.filteredCurrencies.find(curr => curr.id == this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency)?.currName ?? '';
          this.purchaseOrderVendorBillPath = this.formDataApiResult.data?.purchaseOrder?.vendorBillPath ?? '';
          this.isFromAdminToStock = this.formDataApiResult.data?.purchaseOrder?.isFromAdminToStock ?? false;

          // Call to update total amount
          this.updateTotalAmount();
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

  onItemUpdateClick() {
    // Initialize purchaseItems array, ensuring it's defined
    this.forUpdateItems = this.forUpdateItems || new PurchaseOrderWitItems();

    // assign values for Purchase Order 
    this.forUpdateItems.purchaseOrder = {
      purchaseOrderNo : this.purchaseOrderNo
    };

    // assign values for Purchase Order - Items
    this.forUpdateItems.purchaseItems = []; // Clear existing items

    // Select all rows in the table body
    const rows = document.querySelectorAll('#updateItemUpdateTable tbody tr');

    // Loop through all rows except the last two
    for (let i = 0; i < rows.length - 2; i++) {
        const row = rows[i];

        // Extract values from the row
        const id = parseInt(row.querySelector('td:nth-child(1)')?.textContent || '0', 10);
        const rate = parseFloat(row.querySelector('td:nth-child(4)')?.textContent || '0'); 
        const qty = parseFloat((row.querySelector('td:nth-child(5) input[type="number"]') as HTMLInputElement)?.value) || 0; 

        // if( id == 0 || rate == 0 || qty == 0){
        //     alert('Don\'t Put Any Value Zero.');
        //     return;
        // }

        // Push the extracted data to purchaseItems
        this.forUpdateItems.purchaseItems.push({
            id,
            itemRate: rate,
            itemQty: qty
        });
    }

    if(this.forUpdateItems.purchaseItems.length > 0 && this.forUpdateItems.purchaseOrder.purchaseOrderNo){
      this.purchaseService.ReceivedItemsUpdate(this.forUpdateItems).subscribe({
        next: (response: ApiResult<object>) => {
          if (response.result) {
            this.reloadTableData();
            this.sweetAlert.toast('Updated', 'success');
          }
          else {
            this.sweetAlert.toast('Fail To Update', 'warning');
            window.location.reload();
          }

        },
        error: (err) => {
          console.error('Failed To Update Items', err);
        }
      });
    }
    else{
      this.sweetAlert.toast('Fail To Update, Something Went Wrong !!!', 'error');
    }
}


  // BillSendTOAcctsAndStock() {
  //   const formData = new FormData();

  //   if (this.billInputFile?.nativeElement) {
  //     const file = this.billInputFile.nativeElement.files?.[0];
  //     if (file) {
  //       formData.append('purchaseOrderNo', this.purchaseOrderNo);
  //       formData.append('file', file, file.name);

  //       this.purchaseService.BillSendTOAcctsAndStock(formData).subscribe({
  //         next: (response: ApiResult<object>) => {
  //           if (response.result) {
  //             this.router.navigate(['/admin/waiting']);
  //           }
  //           else {
  //             this.sweetAlert.toast('Fail To Save', 'warning');
  //           }

  //         },
  //         error: (err) => {
  //           console.error('Error fetching Users', err);
  //         }
  //       });

  //     } else {
  //       this.sweetAlert.toast('No file selected', 'warning');
  //     }
  //   }
  // }

  BillSendTOAcctsAndStock() {
    // Helper function to get file from input, returns null if no file selected
    const getFileFromInput = (inputElement: ElementRef<HTMLInputElement> | null, fileType: string): File | null => {
      if (inputElement?.nativeElement?.files?.[0]) {
        return inputElement.nativeElement.files[0];
      } else {
        this.sweetAlert.toast(`No file selected ${fileType}`, 'warning');
        return null;
      }
    };
  
    // Validation based on isAlreadyPaid
    let billFile: File | null = null;
    let receiptFile: File | null = null;
  
    // If isAlreadyPaid is false, only billFile is required
    if (!this.isAlreadyPaid) {
      billFile = getFileFromInput(this.billInputFile, 'Vendor Bill');
      if (!billFile) return; // Return early if billFile is not selected
    }
  
    // If isAlreadyPaid is true, both billFile and receiptFile are required
    if (this.isAlreadyPaid) {
      billFile = getFileFromInput(this.billInputFile, 'Vendor Bill');
      receiptFile = getFileFromInput(this.receiptInputFile, 'Payment Receipt');
      if (!billFile || !receiptFile) return; // Return early if any file is not selected
    }
  
    // Create FormData and append files
    const formData = new FormData();
    if (billFile) {
      formData.append('purchaseOrderNo', this.purchaseOrderNo);
      formData.append('billFile', billFile, billFile.name);
      formData.append('isAlreadyPaid', this.isAlreadyPaid.toString());
      formData.append('adminReceiveMess', this.adminReceiveMess);
    }
    if (receiptFile) {
      formData.append('receiptFile', receiptFile, receiptFile.name);
    }
  
    // Send data to the service
    this.purchaseService.BillSendTOAcctsAndStock(formData).subscribe({
      next: (response: ApiResult<object>) => {
        if (response.result) {
          this.router.navigate(['/admin/waiting']);
        } else {
          this.sweetAlert.toast('Fail To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error sending files', err);
        this.sweetAlert.toast('Error sending files', 'error');
      }
    });
  }
  
  
  BillSendTOAcctsWithBillAndReceipt() {
    // Helper function to get file from input, returns null if no file selected
    const getFileFromInput = (inputElement: ElementRef<HTMLInputElement> | null, fileType: string): File | null => {
      if (inputElement?.nativeElement?.files?.[0]) {
        return inputElement.nativeElement.files[0];
      } else {
        this.sweetAlert.toast(`No file selected ${fileType}`, 'warning');
        return null;
      }
    };
  
    // Validation based on isAlreadyPaid
    let billFile: File | null = null;
    let receiptFile: File | null = null;
  
    // If isAlreadyPaid is false, only billFile is required
    if (!this.isAlreadyPaid) {
      billFile = getFileFromInput(this.billInputFile, 'Vendor Bill');
      if (!billFile) return; // Return early if billFile is not selected
    }
  
    // If isAlreadyPaid is true, both billFile and receiptFile are required
    if (this.isAlreadyPaid) {
      billFile = getFileFromInput(this.billInputFile, 'Vendor Bill');
      receiptFile = getFileFromInput(this.receiptInputFile, 'Payment Receipt');
      if (!billFile || !receiptFile) return; // Return early if any file is not selected
    }
  
    // Create FormData and append files
    const formData = new FormData();
    if (billFile) {
      formData.append('purchaseOrderNo', this.purchaseOrderNo);
      formData.append('billFile', billFile, billFile.name);
      formData.append('isAlreadyPaid', this.isAlreadyPaid.toString());
      formData.append('adminReceiveMess', this.adminReceiveMess);
    }
    if (receiptFile) {
      formData.append('receiptFile', receiptFile, receiptFile.name);
    }
  
    // Send data to the service
    this.purchaseService.BillSendTOAcctsWithBillAndReceipt(formData).subscribe({
      next: (response: ApiResult<object>) => {
        if (response.result) {
          this.router.navigate(['/admin/waiting']);
        } else {
          this.sweetAlert.toast('Fail To Save', 'warning');
        }
      },
      error: (err) => {
        console.error('Error sending files', err);
        this.sweetAlert.toast('Error sending files', 'error');
      }
    });
  }
  
  ItemsSendToStock() {
    if (this.purchaseOrderNo) {
      this.purchaseService.ItemsSendToStock(this.purchaseOrderNo).subscribe({
        next: (response: ApiResult<Object>) => {
          if (response.result) {
            this.router.navigate(['/admin/waiting']);
          } else {
            this.sweetAlert.toast('Fail To Send To Stock', 'warning');
          }
        },
        error: (err) => {
          console.error('Error sending item to Stock', err);
          this.sweetAlert.toast('Fail To Send To Stock', 'error');
        }
      });
    }
    else {
      this.sweetAlert.message('Fail To Get Purchase Order No.', 'error');
    }
  }
  
  // Method to calculate the amount for an item
  calculateAmount(item: any): number {
    let itemTotal = (item?.itemRate ?? 0) * (item?.itemQty ?? 0);
    return parseFloat(itemTotal.toFixed(1));
  }

  updateTotalAmount() {
    const purchaseItems = this.formDataApiResult?.data?.purchaseItems;

    if (purchaseItems && Array.isArray(purchaseItems)) {
      this.totalAmount = parseFloat(purchaseItems.reduce((sum, item) => sum + this.calculateAmount(item), 0).toFixed(2));
    } else {
      this.totalAmount = 0; // Handle the case where purchaseItems is undefined or not an array
    }
  }


  formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  limitInput(event: Event, maxLimit: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Remove any non-numeric characters (if input type is not strictly enforced)
    value = value.replace(/[^0-9]/g, '');
  
    // If the value is greater than the max limit, truncate it to the max limit
    if (parseInt(value, 10) > maxLimit) {
      value = maxLimit.toString();
    }
  
    // If there's any decimal (e.g., "2.5"), remove it and keep only the integer part
    if (value.includes('.')) {
      value = value.split('.')[0]; // Remove the decimal part
    }
  
    // Update the input value to ensure it remains within the limit and is an integer
    input.value = value;
  }
  

  reloadTableData(){
    this.loadCurrency();

    this.route.paramMap.subscribe(params => {
      this.purchaseOrderNo_FromQuery = params.get('purchaseOrderNo');
    });

    if (this.purchaseOrderNo_FromQuery) {
      this.GetReceivedItemsForUpdate(this.purchaseOrderNo_FromQuery);
    } else {
      this.sweetAlert.message('Purchase Order Number is Null', 'warning');
    }
  }

  private loadCurrency(): void {
    this.currencyService.getCurrencies().subscribe({
      next: (response: ApiResult<CurrencyMaster>) => {
        this.currencyListApiResult = response;
        this.filteredCurrencies = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching currencies', err);
        this.currencyListApiResult = { dataList: [], result: false, message: 'Error fetching currencies' };
        this.filteredCurrencies = [];
      }
    });
  }
}
