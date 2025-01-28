import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { ServiceOrderWithItemAndImage } from '../../core/DTOs/ServiceOrderWithItemAndImage';
import { ItemHistoryDetail } from '../../core/DTOs/ItemHistoryDetail';

@Injectable({
  providedIn: 'root'
})
export class ServiceDirectorMngService {

  http = inject(HttpClient);

  constructor() { }

  GetServicePendingItemsForApprovalAtDirector(serviceOrderNo: string): Observable<ApiResult<ServiceOrderWithItemAndImage>> {
    return this.http.get<ApiResult<ServiceOrderWithItemAndImage>>(`${ApiUrl.baseApiUrl}${ApiUrl.service_Director.Get_Service_Pending_Items_For_Approval_At_Director}${serviceOrderNo}`);
  }

  GetServiceItemHistoryByServiceItemIdAtDirector(serviceItemId: number): Observable<ApiResult<ItemHistoryDetail>> {
    return this.http.get<ApiResult<ItemHistoryDetail>>(`${ApiUrl.baseApiUrl}${ApiUrl.service_Director.Get_Service_Item_History_By_Service_Item_Id_At_Director}${serviceItemId}`);
  }

  RejectServicePendingItemsForApprovalAtDirector(serviceOrderNo: string): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.service_Director.Reject_Service_Pending_Items_For_Approval_At_Director}${serviceOrderNo}`,null);
  }

  RemoveServicePendingItemsForApprovalAtDirector(serviceItemId: number): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.service_Director.Remove_Service_Pending_Items_For_Approval_At_Director}${serviceItemId}`,null);
  }

  ApproveServicePendingItemsForApprovalAtDirector(serviceOrderNo: string): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.service_Director.Approve_Service_Pending_Items_For_Approval_At_Director}${serviceOrderNo}`, null);
  }
}
