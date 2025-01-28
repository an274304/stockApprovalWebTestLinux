import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { CountDashboard } from '../../core/DTOs/CountDashboard';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminServiceService {

  http = inject(HttpClient);
  constructor() { }
  GetCountDashboard(): Observable<ApiResult<CountDashboard>> {
    return this.http.get<ApiResult<CountDashboard>>(`${ApiUrl.baseApiUrl}${ApiUrl.dashboard_Admin.Get_Count_Dashboard}`);
  }

  GetExpensesOfMonthByMonthAndYear(Month : number, Year : number): Observable<ApiResult<CountDashboard>> {
    return this.http.get<ApiResult<CountDashboard>>(`${ApiUrl.baseApiUrl}${ApiUrl.dashboard_Admin.Get_Expenses_Of_Month_By_Month_And_Year}/${Month}/${Year}`);
  }
}
