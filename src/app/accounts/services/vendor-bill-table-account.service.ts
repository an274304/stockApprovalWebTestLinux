import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';

@Injectable({
  providedIn: 'root'
})
export class VendorBillTableAccountService {
  http = inject(HttpClient);
  
  constructor() { }

  GetPendingBillAtAccount(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Account.Get_Pending_Bill_At_Account}`);
  }

  GetPayedBillAtAccount(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Account.Get_Payed_Bill_At_Account}`);
  }

  viewOrderBillDetailAtAccount(purchaseOrderNo : string): Observable<ApiResult<PurchaseOrderWitItems>> {
    return this.http.get<ApiResult<PurchaseOrderWitItems>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Account.View_Order_Bill_Detail_At_Account}${purchaseOrderNo}`);
  }
}
