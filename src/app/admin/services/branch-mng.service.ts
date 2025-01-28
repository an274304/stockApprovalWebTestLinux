import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BranchMaster } from '../../core/Models/BranchMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class BranchMngService {
  http = inject(HttpClient);
  constructor() { }

  getBranches(): Observable<ApiResult<BranchMaster>> {
    return this.http.get<ApiResult<BranchMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.branch.GET_ALL_BRANCH}`);
  }

  saveBranch(branch : FormData): Observable<ApiResult<BranchMaster>> {
    return this.http.post<ApiResult<BranchMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.branch.SAVE_BRANCH}`, branch);
  }

  updateBranch(branch : FormData): Observable<ApiResult<BranchMaster>> {
    return this.http.put<ApiResult<BranchMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.branch.UPDATE_BRANCH}`, branch);
  }

  getBranchById(branchId : number): Observable<ApiResult<BranchMaster>> {
    return this.http.get<ApiResult<BranchMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.branch.GET_BRANCH_BY_ID}${branchId}`);
  }
}
