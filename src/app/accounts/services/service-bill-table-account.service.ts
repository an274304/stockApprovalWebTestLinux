import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceOrder } from '../../core/Models/ServiceOrder';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class ServiceBillTableAccountService {
  http = inject(HttpClient);
  constructor() { }
  GetServicePendingBillAtAccount(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceBillTable_Account.Get_Service_Pending_Bill_At_Account}`);
  }

  GetServicePayedBillAtAccount(): Observable<ApiResult<ServiceOrder>> {
    return this.http.get<ApiResult<ServiceOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceBillTable_Account.Get_Service_Payed_Bill_At_Account}`);
  }
}
