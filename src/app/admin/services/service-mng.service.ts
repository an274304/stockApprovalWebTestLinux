import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { ServiceOrderWithItemAndImage } from '../../core/DTOs/ServiceOrderWithItemAndImage';
import { VendorMaster } from '../../core/Models/VendorMaster';

@Injectable({
  providedIn: 'root'
})
export class ServiceMngService {

  http = inject(HttpClient);

  constructor() { }

  serviceOrder(serviceOrderWithItemAndImage: FormData): Observable<ApiResult<string>> {
    return this.http.post<ApiResult<string>>(`${ApiUrl.baseApiUrl}${ApiUrl.service.SERVICE_ORDER}`, serviceOrderWithItemAndImage);
  }

  serviceItemsSendToVendor(serviceOrderNo: string): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.service.SERVICE_ITEMS_SEND_TO_VENDOR}${serviceOrderNo}`, null);
  }

  SERVICE_ITEMS_SEND_TO_COMPLETED(serviceOrderNo: string): Observable<ApiResult<Object>> {
    return this.http.put<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.service.SERVICE_ITEMS_SEND_TO_COMPLETED}${serviceOrderNo}`, null);
  }

    //#region  Additional Call
    GetServiceVendorDtlsByserviceOrderNo(serviceOrderNo: string): Observable<ApiResult<VendorMaster>> {
      return this.http.get<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.service.Get_Service__Vendor_Dtls_By_ServiceOrderNo}${serviceOrderNo}`);
    }
    //#endregion
}
