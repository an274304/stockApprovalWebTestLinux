import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CountDashboard } from '../../core/DTOs/CountDashboard';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class DashboardAccountService {
  http = inject(HttpClient);
  constructor() { }
  GetCountDashboard(): Observable<ApiResult<CountDashboard>> {
    return this.http.get<ApiResult<CountDashboard>>(`${ApiUrl.baseApiUrl}${ApiUrl.dashboard_Account.Get_Count_Dashboard}`);
  }
}
