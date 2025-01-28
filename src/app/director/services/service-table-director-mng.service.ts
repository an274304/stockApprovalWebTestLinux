import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ServiceOrder } from '../../core/Models/ServiceOrder';
import { ServiceItem } from '../../core/Models/ServiceItem';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class ServiceTableDirectorMngService {
  http = inject(HttpClient);
  
  constructor() { }

  GetServicePendingAtDirector(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_Service_Pending_At_Director}`);
  }
  GetAllServiceItemByOrderNo(ServiceOrderNo : string): Observable<ApiResult<ServiceItem>> {
    return this.http.get<ApiResult<ServiceItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_All_Service_Item_By_OrderNo_At_Director}${ServiceOrderNo}`);
  }

  //#region Approved Table
  GetServiceApprovedAtDirector(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_Service_Approved_At_Director}`);
  }
  GetServiceApprovedItemByOrderNo(ServiceOrderNo : string): Observable<ApiResult<ServiceItem>> {
    return this.http.get<ApiResult<ServiceItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_Service_Approved_Item_By_OrderNo_At_Director}${ServiceOrderNo}`);
  }
  //#endregionregion 

  //#region Rejected Table
  GetServiceRejectedAtDirector(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_Service_Rejected_At_Director}`);
  }
  GetServiceRejectedItemByOrderNo(ServiceOrderNo : string): Observable<ApiResult<ServiceItem>> {
    return this.http.get<ApiResult<ServiceItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceTable_Director.Get_Service_Rejected_Item_By_OrderNo_At_Director}${ServiceOrderNo}`);
  }
  //#endregion
}
