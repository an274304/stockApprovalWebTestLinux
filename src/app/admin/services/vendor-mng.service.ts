import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { VendorMaster } from '../../core/Models/VendorMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorMngService {
  http = inject(HttpClient);
  constructor() { }
  getVendors(): Observable<ApiResult<VendorMaster>> {
    return this.http.get<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendor.GET_ALL_VENDOR}`);
  }

  getAllVendorByCatId(catId : number): Observable<ApiResult<VendorMaster>> {
    return this.http.get<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendor.GET_ALL_VENDOR_BY_CAT_ID}${catId}`);
  }

  saveVendor(category : FormData): Observable<ApiResult<VendorMaster>> {
    return this.http.post<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendor.SAVE_VENDOR}`, category);
  }

  updateVendor(category : FormData): Observable<ApiResult<VendorMaster>> {
    return this.http.put<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendor.UPDATE_VENDOR}`, category);
  }

  getVendorById(catId : number): Observable<ApiResult<VendorMaster>> {
    return this.http.get<ApiResult<VendorMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.vendor.GET_VENDOR_BY_ID}${catId}`);
  }
}
