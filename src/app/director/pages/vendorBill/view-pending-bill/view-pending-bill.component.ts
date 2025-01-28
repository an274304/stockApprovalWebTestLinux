import { Component, OnInit } from '@angular/core';
import { VendorBillService } from '../../../services/vendor-bill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderWitItems } from '../../../../core/DTOs/PurchaseOrderWitItems';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CurrencyMaster } from '../../../../core/Models/CurrencyMaster';
import { CurrencyMngService } from '../../../../admin/services/currency-mng.service';
import { ItemHistoryDetail } from '../../../../core/DTOs/ItemHistoryDetail';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
declare var $ : any;

@Component({
  selector: 'app-view-pending-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-pending-bill.component.html',
  styleUrl: './view-pending-bill.component.css'
})
export class ViewPendingBillComponent implements OnInit {

  purchaseOrderNo_FromQuery: string | null = null;

  formDataApiResult: ApiResult<PurchaseOrderWitItems> = { data: undefined, result: false, message: 'Connection Not Available.' };
  itemHistoryApiResult: ApiResult<ItemHistoryDetail> = { data: undefined, dataList: [], result: false, message: 'Connection Not Available.' };
  currencyListApiResult: ApiResult<CurrencyMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };

  currency: string = '';
  purchaseOrderNo: string = '';
  purchaseOrderRemark: string = '';
  directorMessage: string = '';
  purchaseOrderDt: string = '';
  purchaseDeliveryDt: string = '';
  popCurrentItemName: string = '';
  totalAmount: number = 0;
  hoveredImage: string | null = null;

  filteredCurrencies : CurrencyMaster[] = [];
  itemHistoryList : ItemHistoryDetail[] = [];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private vendorBillService: VendorBillService, 
    private currencyService : CurrencyMngService,
    private sweetAlert : SweetAlertService
  ) {

  }

  ngOnInit(): void {
    this.loadCurrency();

    this.route.paramMap.subscribe(params => {
      this.purchaseOrderNo_FromQuery = params.get('purchaseOrderNo');
    });

    if (this.purchaseOrderNo_FromQuery) {
      this.GetPendingItemsForApproval(this.purchaseOrderNo_FromQuery);
    } else {
      this.sweetAlert.message('Purchase Order Number is Null', 'error');
    }
  }

  GetPendingItemsForApproval(purchaseOrderNo: string) {
    this.vendorBillService.GetPendingItemsForApproval(purchaseOrderNo).subscribe({
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
         // this.currency = this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency ?? '';

          this.currency = this.filteredCurrencies.find(curr => curr.id == this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency)?.currName ?? '';

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

  approveOrder() {
    if (this.purchaseOrderNo) {

      const purchaseOrder = new PurchaseOrder({
        purchaseOrderNo : this.purchaseOrderNo,
        approveDirectorMess : this.directorMessage.slice(0, 500)
      });

      this.vendorBillService.ApprovePendingItemsForApproval(purchaseOrder).subscribe({
        next: (response: ApiResult<object>) => {
          if (response.result) {
            this.sweetAlert.message('Successfully Approve', 'success');
            this.router.navigate(['/director']);
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
    else {
      this.sweetAlert.toast('Purchase Order No. Not Available', 'warning');
    }
  }

  rejectOrder() {
    if (this.purchaseOrderNo) {

      const purchaseOrder = new PurchaseOrder({
        purchaseOrderNo : this.purchaseOrderNo,
        rejectDirectorMess : this.directorMessage.slice(0, 500)
      });

      this.vendorBillService.RejectPendingItemsForApproval(purchaseOrder).subscribe({
        next: (response: ApiResult<object>) => {
          if (response.result) {
            this.sweetAlert.message('Successfully Rejected', 'success');
            this.router.navigate(['/director']);
          }
          else {
            this.sweetAlert.toast('Fail To Reject', 'warning');
          }
        },
        error: (err: any) => {
          console.error('Error fetching Order Details', err);
        }
      });
    }
    else {
      this.sweetAlert.message('Purchase Order No. Not Available', 'error');
    }
  }

  removeItem(purchaseItemId : number) {
      this.vendorBillService.RemovePendingItemsForApproval(purchaseItemId).subscribe({
        next: (response: ApiResult<object>) => {
          if (response.result) {
            this.sweetAlert.toast('Successfully Removed', 'success');
            this.GetPendingItemsForApproval(this.purchaseOrderNo_FromQuery ?? '');
          }
          else {
            this.sweetAlert.toast('Fail To removed', 'warning');
          }
        },
        error: (err: any) => {
          console.error('Error fetching Order Details', err);
        }
      });

  }

  showHistoryOfItem(purchaseItemId : number) {
   
    this.vendorBillService.GetItemHistoryDetailByPurchaseItemId(purchaseItemId).subscribe({
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
                       <th>PO No.</th>
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
    return parseFloat(itemTotal.toFixed(1));
  }

  updateTotalAmount() {
    const purchaseItems = this.formDataApiResult?.data?.purchaseItems;

    if (purchaseItems && Array.isArray(purchaseItems)) {
      this.totalAmount = purchaseItems.reduce((sum, item) => sum + this.calculateAmount(item), 0);
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
