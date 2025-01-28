import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { UserTypeMaster } from '../../core/Models/UserTypeMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http : HttpClient) { 

  }


  // LogIn(Email:string, Password:string, isRemember:boolean){
  //   // Statically return values for testing purposes
  //   return of({
  //     token: 'sample-token-123456',
  //     userName: 'TestUser',
  //     userId: '12345',
  //     userRole: 'Admin'
  //   });
  // }

  // For Api Hit
  LogIn(Email:string, Password:string, isRemember:boolean){
    return this.http.post<{token:string, userName:string, userId:string, userRole:string, userImage:string}>(`${ApiUrl.baseApiUrl}${ApiUrl.auth.AUTH}`,
      {
        email:Email,
        password:Password,
        isRemember:isRemember
      }
    );
  }

  GetAllUserType() : Observable<ApiResult<UserTypeMaster>>{
    return this.http.get<ApiResult<UserTypeMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.auth.GET_ALL_USER_TYPE}`);
  }
}
