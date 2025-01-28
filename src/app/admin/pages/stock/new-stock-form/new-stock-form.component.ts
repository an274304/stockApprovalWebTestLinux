import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderWitItems } from '../../../../core/DTOs/PurchaseOrderWitItems';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { StockMngService } from '../../../services/stock-mng.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UpdateNewStockItem } from '../../../../core/DTOs/UpdateNewStockItem';
import { UpdatedStockMasterItemTableComponent } from "../../../components/updated-stock-master-item-table/updated-stock-master-item-table.component";
import { StockItemMaster } from '../../../../core/Models/StockItemMaster';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-new-stock-form',
  standalone: true,
  imports: [CommonModule, FormsModule, UpdatedStockMasterItemTableComponent],
  templateUrl: './new-stock-form.component.html',
  styleUrl: './new-stock-form.component.css'
})
export class NewStockFormComponent implements OnInit {
  purchaseOrderNo_FromQuery: string | null = null;
  formDataApiResult: ApiResult<PurchaseOrderWitItems> = { data: undefined, result: false, message: 'Connection Not Available.' };
  updatedStockMasterItem_ApiResult: ApiResult<StockItemMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  updatedStockMasterItem: StockItemMaster[] = []; // To hold updated stock items
  isStockMasterItemUpdated : boolean = false;

  currency: string = '';
  purchaseOrderNo: string = '';
  purchaseOrderRemark: string = '';
  purchaseOrderVendorBillPath: string = '';
  purchaseOrderDt: string = '';
  purchaseDeliveryDt: string = '';
  purchaseOrderAcctsBillPayReceipt: string = '';
  purchaseOrderIsAdminNewStockUpdate: boolean = false;


  constructor(private route: ActivatedRoute, 
    private stockMngService: StockMngService,
    private sweetAlert : SweetAlertService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.purchaseOrderNo_FromQuery = param.get('purchaseOrderNo');
    });

    if (this.purchaseOrderNo_FromQuery) {
      this.GetNewStockItemsAtAdmin(this.purchaseOrderNo_FromQuery);
    }
    else {
      this.sweetAlert.message('Purchase Order No Is Null', 'warning');
    }
  }

  GetNewStockItemsAtAdmin(purchaseOrderNo: string) {
    this.stockMngService.GetNewStockItemsAtAdmin(purchaseOrderNo).subscribe({
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
          this.purchaseOrderIsAdminNewStockUpdate = this.formDataApiResult.data?.purchaseOrder?.isAdminNewStockUpdate ?? false;
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

  // Method to handle Add To Stock button click
  addToStock() {

    if (!this.validateForm()) {
      this.sweetAlert.toast('Please fill in all required expiry dates.', 'warning');
      return;
  }

    const newStockItems: UpdateNewStockItem[] = [];

    // Loop through the purchase items and create a list of UpdateNewStockItem
    if (this.formDataApiResult.data?.purchaseItems) {
      this.formDataApiResult.data.purchaseItems.forEach(item => {
        if (item.id) { // Ensure item has an ID
          const newItem = new UpdateNewStockItem({
            purchaseOrderNo: this.purchaseOrderNo,
            purchaseItemId: item.id,
            itemExpiryDt: item.updated // Bind expiry date from the table input
          });
          newStockItems.push(newItem);
        }
      });
    }

    // Send the list of new stock items to the API
    this.stockMngService.UpdateNewStockItem(newStockItems).subscribe({
      next: (response: ApiResult<object>) => {
        if (response.result) {
          this.loadUpdatedStockMasterItems(this.purchaseOrderNo);
        } else {
          this.sweetAlert.toast('Failed To Update Stock', 'warning');
        }
      },
      error: (err) => console.error('Error updating stock', err)
    });
  }

  loadUpdatedStockMasterItems(purchaseOrderNo : string){
    this.stockMngService.loadUpdatedStockMasterItems(purchaseOrderNo).subscribe({
      next: (response: ApiResult<StockItemMaster>) => {
        if (response.result) {
          this.updatedStockMasterItem_ApiResult = response;
          this.updatedStockMasterItem = this.updatedStockMasterItem_ApiResult.dataList ?? [];
          if(this.updatedStockMasterItem.length > 0){
              this.isStockMasterItemUpdated = true;
          }
        } else {
          this.sweetAlert.toast('Failed To Fetch Stock Item Master', 'warning');
        }
      },
      error: (err) => console.error('Error fetching stock', err)
    });
  }

  formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  validateForm(): boolean {
    let isValid = true;

    this.formDataApiResult.data?.purchaseItems?.forEach(item => {
        if (!item.updated) {
            isValid = false;
        }
    });

    return isValid;
}

}
