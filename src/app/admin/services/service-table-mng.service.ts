import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ServiceOrder } from '../../core/Models/ServiceOrder';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class ServiceTableMngService {
  http = inject(HttpClient);
  constructor() { }

  GetServiceApprovalPendingOrderAtAdmin(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable.Get_Service_Approval_Pending_Order_At_Admin}`);
  }

  GetServiceApprovedOrderAtAdmin(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable.Get_Service_Approved_Order_At_Admin}`);
  }

  GetServiceRejectedOrderAtAdmin(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable.Get_Service_Rejected_Order_At_Admin}`);
  }

  GetServiceWaitingOrderAtAdmin(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable.Get_Service_Waiting_Order_At_Admin}`);
  }
}
