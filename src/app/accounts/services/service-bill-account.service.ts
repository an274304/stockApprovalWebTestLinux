import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceOrderWithItemAndImage } from '../../core/DTOs/ServiceOrderWithItemAndImage';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class ServiceBillAccountService {
  http = inject(HttpClient);
  constructor() { }

  viewServiceOrderBillDetailAtAccount(serviceOrderNo : string): Observable<ApiResult<ServiceOrderWithItemAndImage>> {
    return this.http.get<ApiResult<ServiceOrderWithItemAndImage>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceBill_Account.View_Service_Order_Bill_Detail_At_Account}${serviceOrderNo}`);
  }

  UploadPayedReceiptForServiceBill(form: FormData): Observable<ApiResult<Object>> {
    return this.http.patch<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.serviceBill_Account.Upload_Payed_Receipt_For_Service_Bill}`, form);
  }
}
