import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartmentMaster } from '../../core/Models/DepartmentMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMngService {
  http = inject(HttpClient);
  constructor() { }
  getDepartments(): Observable<ApiResult<DepartmentMaster>> {
    return this.http.get<ApiResult<DepartmentMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.department.GET_ALL_DEPARTMENT}`);
  }

  saveDepartment(department : FormData): Observable<ApiResult<DepartmentMaster>> {
    return this.http.post<ApiResult<DepartmentMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.department.SAVE_DEPARTMENT}`, department);
  }

  updateDepartment(department : FormData): Observable<ApiResult<DepartmentMaster>> {
    return this.http.put<ApiResult<DepartmentMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.department.UPDATE_DEPARTMENT}`, department);
  }

  getDepartmentById(departmentId : number): Observable<ApiResult<DepartmentMaster>> {
    return this.http.get<ApiResult<DepartmentMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.department.GET_DEPARTMENT_BY_ID}${departmentId}`);
  }
}
