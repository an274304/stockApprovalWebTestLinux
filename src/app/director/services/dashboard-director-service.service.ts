import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { CountDashboard } from '../../core/DTOs/CountDashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardDirectorServiceService {
  http = inject(HttpClient);
  constructor() { }
  GetCountDashboard(): Observable<ApiResult<CountDashboard>> {
    return this.http.get<ApiResult<CountDashboard>>(`${ApiUrl.baseApiUrl}${ApiUrl.dashboard_Director.Get_Count_Dashboard}`);
  }
}
