import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { CurrencyMaster } from '../../core/Models/CurrencyMaster';

@Injectable({
  providedIn: 'root'
})

export class CurrencyMngService {
  http = inject(HttpClient);
  constructor() { }
  getCurrencies(): Observable<ApiResult<CurrencyMaster>> {
    return this.http.get<ApiResult<CurrencyMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.currency.GET_ALL_CURRENCY}`);
  }

  saveCurrency(currency : FormData): Observable<ApiResult<CurrencyMaster>> {
    return this.http.post<ApiResult<CurrencyMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.currency.SAVE_CURRENCY}`, currency);
  }

  updateCurrency(currency : FormData): Observable<ApiResult<CurrencyMaster>> {
    return this.http.put<ApiResult<CurrencyMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.currency.UPDATE_CURRENCY}`, currency);
  }

  getCurrencyById(currencyId : number): Observable<ApiResult<CurrencyMaster>> {
    return this.http.get<ApiResult<CurrencyMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.currency.GET_CURRENCY_BY_ID}${currencyId}`);
  }
}
