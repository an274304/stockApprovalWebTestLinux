import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { ItemHistoryDetail } from '../../core/DTOs/ItemHistoryDetail';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';

@Injectable({
  providedIn: 'root'
})
export class VendorBillService {
  http = inject(HttpClient);
  
  constructor() { }

  GetPendingItemsForApproval(purchaseOrderNo: string): Observable<ApiResult<PurchaseOrderWitItems>> {
    return this.http.get<ApiResult<PurchaseOrderWitItems>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBill_Director.Get_Pending_Items_For_Approval_At_Director}${purchaseOrderNo}`);
  }

  GetItemHistoryDetailByPurchaseItemId(purchaseItemId: number): Observable<ApiResult<ItemHistoryDetail>> {
    return this.http.get<ApiResult<ItemHistoryDetail>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBill_Director.Get_Item_History_Detail_By_Purchase_Item_Id}${purchaseItemId}`);
  }

  // RejectPendingItemsForApproval(purchaseOrderNo: string): Observable<ApiResult<object>> {
  //   return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Items_Reject_By_Director}${purchaseOrderNo}`,null);
  // }

  RejectPendingItemsForApproval(purchaseOrder: PurchaseOrder): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Items_Reject_By_Director}`,purchaseOrder);
  }

  RemovePendingItemsForApproval(purchaseItemId: number): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Remove_Item_By_Director}${purchaseItemId}`,null);
  }

  ApprovePendingItemsForApproval(purchaseOrder: PurchaseOrder): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Items_Approve_By_Director}`, purchaseOrder);
  }
}
