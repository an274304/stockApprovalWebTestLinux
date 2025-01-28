import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class PurchaseTableMngService {

  http = inject(HttpClient);
  
  constructor() { }

  GetApprovalPendingOrderAtAdmin(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchaseTable.Get_Approval_Pending_Order_At_Admin}`);
  }

  GetApprovedOrderAtAdmin(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchaseTable.Get_Approved_Order_At_Admin}`);
  }

  GetRejectedOrderAtAdmin(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchaseTable.Get_Rejected_Order_At_Admin}`);
  }

  GetWaitingOrderAtAdmin(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchaseTable.Get_Waiting_Order_At_Admin}`);
  }
  
  GetOrderToApproveAtDirector(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchaseTable.Get_Order_To_Approve_At_Director}`);
  }
}
