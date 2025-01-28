import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { CategoryMaster } from '../../core/Models/CategoryMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryMngService {

  http = inject(HttpClient);

  constructor() { }

  getCategories(): Observable<ApiResult<CategoryMaster>> {
    return this.http.get<ApiResult<CategoryMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.category.GET_ALL_CATEGORY}`);
  }

  saveCategory(category : FormData): Observable<ApiResult<CategoryMaster>> {
    return this.http.post<ApiResult<CategoryMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.category.SAVE_CATEGORY}`, category);
  }

  updateCategory(category : FormData): Observable<ApiResult<CategoryMaster>> {
    return this.http.put<ApiResult<CategoryMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.category.UPDATE_CATEGORY}`, category);
  }

  getCategoryById(catId : number): Observable<ApiResult<CategoryMaster>> {
    return this.http.get<ApiResult<CategoryMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.category.GET_CATEGORY_BY_ID}${catId}`);
  }
}
