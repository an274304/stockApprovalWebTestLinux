import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceOrderWithItemAndImage } from '../../../../core/DTOs/ServiceOrderWithItemAndImage';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ItemHistoryDetail } from '../../../../core/DTOs/ItemHistoryDetail';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyMngService } from '../../../../admin/services/currency-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { ServiceBillAccountService } from '../../../services/service-bill-account.service';
import { ServiceDirectorMngService } from '../../../../director/services/service-director-mng.service';
declare var $ : any;

@Component({
  selector: 'app-view-service-pending-bill',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './view-service-pending-bill.component.html',
  styleUrl: './view-service-pending-bill.component.css'
})
export class ViewServicePendingBillComponent {
  ServiceOrderNo_FromQuery: string | null = null;

  @ViewChild('billInputFile') billInputFile: ElementRef<HTMLInputElement> | undefined;

  formDataApiResult: ApiResult<ServiceOrderWithItemAndImage> = { data: undefined, result: false, message: 'Connection Not Available.' };
  itemHistoryApiResult: ApiResult<ItemHistoryDetail> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };
  currencyListApiResult: ApiResult<CurrencyMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  currency: string = '';
  serviceOrderNo: string = '';
  serviceOrderRemark: string = '';
  serviceOrderDt: string = '';
  serviceDeliveryDt: string = '';
  popCurrentItemName: string = '';
  totalAmount: number = 0;

  itemImages: File[] = []; // Array to hold image files
  imagePreviews: string[] = []; // Array for object URLs
  hoveredImage: string | null = null;

  filteredCurrencies : CurrencyMaster[] = [];
  itemHistoryList : ItemHistoryDetail[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private serviceBillAccount: ServiceBillAccountService, 
    private serviceDirectorMng: ServiceDirectorMngService, 
    private currencyService : CurrencyMngService,
    private sweetAlert : SweetAlertService
  ) {

  }

  ngOnInit(): void {
    this.loadCurrency();

    this.route.paramMap.subscribe(params => {
      this.ServiceOrderNo_FromQuery = params.get('serviceOrderNo');
    });

    if (this.ServiceOrderNo_FromQuery) {
      this.viewServiceOrderBillDetailAtAccount(this.ServiceOrderNo_FromQuery);
    } else {
      this.sweetAlert.message('Service Order Number is Null', 'error');
    }
  }

  viewServiceOrderBillDetailAtAccount(serviceOrderNo: string) {
    this.serviceBillAccount.viewServiceOrderBillDetailAtAccount(serviceOrderNo).subscribe({
      next: (response: ApiResult<ServiceOrderWithItemAndImage>) => {
        if (response.result) {

          this.formDataApiResult = response ?? null;

          this.serviceOrderNo = this.formDataApiResult.data?.serviceOrder?.serviceOrderNo ?? '';
          this.serviceOrderDt = this.formDataApiResult.data?.serviceOrder?.serviceOrderDt
            ? this.formatDate(this.formDataApiResult.data.serviceOrder.serviceOrderDt)
            : '';

          this.serviceDeliveryDt = this.formDataApiResult.data?.serviceOrder?.serviceExpDelDt
            ? this.formatDate(this.formDataApiResult.data.serviceOrder.serviceExpDelDt)
            : '';

          this.serviceOrderRemark = this.formDataApiResult.data?.serviceOrder?.serviceRemark ?? '';
         // this.currency = this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency ?? '';

          this.currency = this.filteredCurrencies.find(curr => curr.id == this.formDataApiResult.data?.serviceOrder?.serviceCurrency)?.currName ?? '';

          // Call to update total amount
          this.updateTotalAmount();
        }
        else {
          this.sweetAlert.toast('Fail To Approve', 'warning');
        }

      },
      error: (err: any) => {
        console.error('Error fetching Order Details', err);
      }
    });
  }

  UploadBillReceipt(){
    const formData = new FormData();

    if (this.billInputFile?.nativeElement) {
      const file = this.billInputFile.nativeElement.files?.[0];
      if (file) {
        formData.append('serviceOrderNo', this.serviceOrderNo);
        formData.append('file', file, file.name);

        this.serviceBillAccount.UploadPayedReceiptForServiceBill(formData).subscribe({
          next: (response: ApiResult<object>) => {
            if (response.result) {
              this.router.navigate(['/account/service-pending']);
            }
            else {
              this.sweetAlert.toast('Fail To Upload Receipt', 'warning');
            }
    
          },
          error: (err) => {
            console.error('Error fetching Users', err);
          }
        });


      } else {
        this.sweetAlert.toast('No file selected', 'warning');
      }
    }
  }

  showHistoryOfItem(serviceItemId : number) {
   
    this.serviceDirectorMng.GetServiceItemHistoryByServiceItemIdAtDirector(serviceItemId).subscribe({
      next: (response: ApiResult<ItemHistoryDetail>) => {
        if (response.result) {
          this.itemHistoryApiResult = response;
          this.itemHistoryList = this.itemHistoryApiResult.dataList || [];
          this.popCurrentItemName = this.itemHistoryList.length > 0 ? this.itemHistoryList[0].productName || '' : '';
    
          // Update the modal body with new content
          $('#OrderHistoryItemsPop .modal-body').html(`
           <table class="table table-sm table-hover table-bordered border-light">
               <thead>
                   <tr>
                       <th>Sn.</th>
                       <th>SO No.</th>
                       <th>Cat. Name</th>
                       <th>Pro. Name</th>
                       <th>Ven. Name</th>
                       <th>Rate</th>
                       <th>Qty</th>
                       <th>Total</th>
                       <th>Req. Dt</th>
                       <th>Req. By</th>
                       <th>App. Dt</th>
                       <th>App. By</th>
                   </tr>
               </thead>
               <tbody>
                   ${this.itemHistoryList?.length > 0
                       ? this.itemHistoryList.map((item, index) => `
                           <tr>
                               <td>${index + 1}</td>
                              <td>${item.orderNo}</td>
                              <td>${item.categoryName}</td>
                              <td>${item.productName}</td>
                              <td>${item.vendorName}</td>
                              <td>${item.itemRate}</td>
                              <td>${item.itemQty}</td>
                              <td>${(item.itemRate ?? 0) * (item.itemQty ?? 0)}</td>
                              <td>${this.formatDate(item.requestedDate ?? new Date())}</td>
                              <td>${item.requestedBy}</td>
                              <td>${this.formatDate(item.approveDate ?? new Date())}</td>
                              <td>${item.approveBy}</td>
                           </tr>
                       `).join('')
                       : '<tr><td colspan="12" class="text-danger">No Items Found!</td></tr>'
                   }
               </tbody>
           </table>
       `);
          $('#OrderHistoryItemsPop').modal('show');
        }
        else {
          this.sweetAlert.toast('History Not Available', 'warning');
        }
      },
      error: (err: any) => {
        console.error('Error fetching History Order Details', err);
      }
    });

}

  // Method to calculate the amount for an item
  calculateAmount(item: any): number {
    let itemTotal = (item?.itemRate ?? 0) * (item?.itemQty ?? 0);
    return itemTotal;
  }

  updateTotalAmount() {
    // Ensure serviceItemWithImages is defined and is an array
    if (Array.isArray(this.formDataApiResult?.data?.serviceItemWithImages)) {
      // Reduce the totalAmount by iterating over each serviceItemWithImage
      this.totalAmount = this.formDataApiResult.data.serviceItemWithImages.reduce((sum, serviceItemWithImage) => {
        if (serviceItemWithImage && serviceItemWithImage.serviceItem) {
          // Access the itemRate and itemQty from the serviceItem and calculate the amount
          const itemTotal = this.calculateAmount(serviceItemWithImage.serviceItem);
          return sum + itemTotal;
        }
        return sum;
      }, 0);
    } else {
      // If serviceItemWithImages is not defined or is not an array, set totalAmount to 0
      this.totalAmount = 0;
    }
  }

  formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

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
