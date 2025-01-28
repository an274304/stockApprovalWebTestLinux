import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ProductMaster } from '../../core/Models/ProductMaster';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { VendorMaster } from '../../core/Models/VendorMaster';

@Injectable({
  providedIn: 'root'
})
export class PurchaseMngService {

  http = inject(HttpClient);

  constructor() { }

  purchaseOrder(PurchaseOrderWitItems: PurchaseOrderWitItems): Observable<ApiResult<PurchaseOrder>> {
    return this.http.post<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.PURCHASE_ORDER}`, PurchaseOrderWitItems);
  }

  ItemsSendToVendor(purchaseOrderNo: string): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.ITEMS_SEND_TO_VENDOR}${purchaseOrderNo}`, null);
  }

  GetReceivedItemsForUpdate(purchaseOrderNo: string): Observable<ApiResult<Object>> {
    return this.http.get<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Get_Received_Items_For_Update}${purchaseOrderNo}`);
  }

  ReceivedItemsUpdate(receivedItemsUpdate: PurchaseOrderWitItems): Observable<ApiResult<Object>> {
    return this.http.patch<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Received_Items_Update}`, receivedItemsUpdate);
  }

  BillSendTOAcctsAndStock(form: FormData): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Bill_Send_TO_Accts_And_Stock}`, form);
  }

  BillSendTOAcctsWithBillAndReceipt(form: FormData): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Bill_Send_TO_Accts_With_Bill_And_Receipt}`, form);
  }

  ItemsSendToStock(purchaseOrderNo: string): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.ITEMS_SEND_TO_STOCK}${purchaseOrderNo}`, null);
  }

  //#region  Additional Call
  GetVendorDtlsByPurchaseOrderNo(purchaseOrderNo: string): Observable<ApiResult<VendorMaster>> {
    return this.http.get<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Get_Vendor_Dtls_By_PurchaseOrderNo}${purchaseOrderNo}`);
  }
  //#endregion
}
