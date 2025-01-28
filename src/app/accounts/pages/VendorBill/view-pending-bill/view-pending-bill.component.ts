import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderWitItems } from '../../../../core/DTOs/PurchaseOrderWitItems';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorBillAccountService } from '../../../services/vendor-bill-account.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-view-pending-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-pending-bill.component.html',
  styleUrl: './view-pending-bill.component.css'
})
export class ViewPendingBillComponent {
  purchaseOrderNo_FromQuery: string | null = null;
  formDataApiResult: ApiResult<PurchaseOrderWitItems> = { data: undefined, result: false, message: 'Connection Not Available.' };
  @ViewChild('billInputFile') billInputFile: ElementRef<HTMLInputElement> | undefined;

  purchaseOrderVendorBillPath: string = '';
  purchaseOrderAcctsBillPayReceipt: string = '';

  currency: string = '';
  purchaseOrderNo: string = '';
  purchaseOrderRemark: string = '';
  purchaseOrderDt: string = '';
  purchaseDeliveryDt: string = '';
  totalAmount: number = 0;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private vendorBillAccountService: VendorBillAccountService,
    private sweetAlert : SweetAlertService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.purchaseOrderNo_FromQuery = params.get('purchaseOrderNo');
    });

    if (this.purchaseOrderNo_FromQuery) {
      this.GetViewPendingBillAtAccount(this.purchaseOrderNo_FromQuery);
    } else {
      this.sweetAlert.message('Purchase Order Number Is Null', 'warning');
    }
  }

  GetViewPendingBillAtAccount(purchaseOrderNo: string) {
    this.vendorBillAccountService.GetViewPendingBillAtAccount(purchaseOrderNo).subscribe({
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
          this.currency = this.formDataApiResult.data?.purchaseOrder?.purchaseCurrency ?? '';
          this.purchaseOrderVendorBillPath = this.formDataApiResult.data?.purchaseOrder?.vendorBillPath ?? '';
          this.purchaseOrderAcctsBillPayReceipt = this.formDataApiResult.data?.purchaseOrder?.acctsBillPayReceipt ?? '';

          // Call to update total amount
          this.updateTotalAmount();
        }
        else {
          this.sweetAlert.toast('Fail To Fetch details', 'warning');
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
        formData.append('purchaseOrderNo', this.purchaseOrderNo);
        formData.append('file', file, file.name);

        this.vendorBillAccountService.UploadPayedReceiptForBill(formData).subscribe({
          next: (response: ApiResult<object>) => {
            if (response.result) {
              this.router.navigate(['/account/bill-pending']);
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
}
