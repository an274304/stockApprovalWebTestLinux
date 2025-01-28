import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { PurchaseItem } from '../../core/Models/PurchaseItem';

@Injectable({
  providedIn: 'root'
})
export class VendorBillTableService {

  http = inject(HttpClient);
  
  constructor() { }

  GetPendingBillAtDirector(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Pending_Bill_At_Director}`);
  }

  GetApprovedPendingItemByOrderNo(PurchaseOrderNo : string): Observable<ApiResult<PurchaseItem>> {
    return this.http.get<ApiResult<PurchaseItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Approved_Pending_Item_By_OrderNo_At_Director}${PurchaseOrderNo}`);
  }

  //#region Approved Table
  GetApprovedBillAtDirector(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Approved_Bill_At_Director}`);
  }
  GetApprovedItemByOrderNo(PurchaseOrderNo : string): Observable<ApiResult<PurchaseItem>> {
    return this.http.get<ApiResult<PurchaseItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Approved_Item_By_OrderNo_At_Director}${PurchaseOrderNo}`);
  }
  //#endregionregion 

  //#region Rejected Table
  GetRejectedBillAtDirector(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Rejected_Bill_At_Director}`);
  }
  GetRejectedItemByOrderNo(PurchaseOrderNo : string): Observable<ApiResult<PurchaseItem>> {
    return this.http.get<ApiResult<PurchaseItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendorBillTable_Director.Get_Rejected_Item_By_OrderNo_At_Director}${PurchaseOrderNo}`);
  }
  //#endregion
 
}
