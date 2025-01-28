import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserMaster } from '../../core/Models/UserMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class UserMngService {
  http = inject(HttpClient);
  constructor() { }
  getUsers(): Observable<ApiResult<UserMaster>> {
    return this.http.get<ApiResult<UserMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.user.GET_ALL_USER}`);
  }

  saveUser(user : FormData): Observable<ApiResult<UserMaster>> {
    return this.http.post<ApiResult<UserMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.user.SAVE_USER}`, user);
  }

  updateUser(user : FormData): Observable<ApiResult<UserMaster>> {
    return this.http.put<ApiResult<UserMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.user.UPDATE_USER}`, user);
  }

  updateUsersPassword(user : FormData): Observable<ApiResult<UserMaster>> {
    return this.http.put<ApiResult<UserMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.user.UPDATE_USERS_PASSWORD}`, user);
  }

  getUserById(userId : number): Observable<ApiResult<UserMaster>> {
    return this.http.get<ApiResult<UserMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.user.GET_USER_BY_ID}${userId}`);
  }
}
