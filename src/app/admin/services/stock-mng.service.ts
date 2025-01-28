import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ApiUrl } from '../../core/Constant/ApiUrl';
import { Observable } from 'rxjs';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';
import { UpdateNewStockItem } from '../../core/DTOs/UpdateNewStockItem';
import { StockItemMaster } from '../../core/Models/StockItemMaster';
import { ShowAvailableStockTable } from '../../core/DTOs/ShowAvailableStockTable';
import { CategoryMaster } from '../../core/Models/CategoryMaster';
import { ProductMaster } from '../../core/Models/ProductMaster';
import { AssignItemToUser } from '../../core/DTOs/AssignItemToUser';
import { AlreadyAssignedItem } from '../../core/DTOs/AlreadyAssignedItem';
import { UserMaster } from '../../core/Models/UserMaster';
import { UserProductInfoDtoForStockTable } from '../../core/DTOs/UserProductInfoDtoForStockTable';

@Injectable({
  providedIn: 'root'
})
export class StockMngService {
  http = inject(HttpClient);
  constructor() { }


  //#region Stock Table
  GetAvailableStockAtAdmin(): Observable<ApiResult<ShowAvailableStockTable>> {
    return this.http.get<ApiResult<ShowAvailableStockTable>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Available_Stock_At_Admin}`);
  }

  getUsersViaAllotedProductId(productId : number): Observable<ApiResult<UserProductInfoDtoForStockTable>> {
    return this.http.get<ApiResult<UserProductInfoDtoForStockTable>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Users_Via_Alloted_Product_Id}${productId}`);
  }
  //#endregion

  //#region Stock In
  GetNewStockAtAdmin(): Observable<ApiResult<PurchaseOrder>> {
    return this.http.get<ApiResult<PurchaseOrder>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_New_Stock_At_Admin}`);
  }

  GetNewStockItemsAtAdmin(purchaseOrderNo: string): Observable<ApiResult<PurchaseOrderWitItems>> {
    return this.http.get<ApiResult<PurchaseOrderWitItems>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_New_Stock_Items_At_Admin}${purchaseOrderNo}`);
  }

  UpdateNewStockItem(newStockItems: UpdateNewStockItem[]): Observable<ApiResult<object>> {
    return this.http.put<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Update_New_Stock_Item}`, newStockItems);
  }

  loadUpdatedStockMasterItems(purchaseOrderNo: string): Observable<ApiResult<StockItemMaster>> {
    return this.http.get<ApiResult<StockItemMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Load_Updated_Stock_Master_Items}${purchaseOrderNo}`);
  }
  //#endregion

  //#region Assign Item
  GetAvailableCategoryForAssignItem(): Observable<ApiResult<CategoryMaster>> {
    debugger;
    return this.http.get<ApiResult<CategoryMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Available_Category_For_Assign_Item}`);
  }

  GetAvailableProductForAssignItem(catId: number): Observable<ApiResult<ProductMaster>> {
    return this.http.get<ApiResult<ProductMaster>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Available_Product_For_Assign_Item}${catId}`);
  }

  GetAvailableItemForAssignItem(proId: number): Observable<ApiResult<object>> {
    return this.http.get<ApiResult<object>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Available_Item_For_Assign_Item}${proId}`);
  }

  AssignItemsToUserAtAdmin(itemDetail: AssignItemToUser): Observable<ApiResult<number>> {
    return this.http.patch<ApiResult<number>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Assign_Items_To_User_At_Admin}`, itemDetail);
  }
  //#endregion

  //#region Item Dispose
  GetAssignedStockItemsByUserId(userId: number): Observable<ApiResult<AlreadyAssignedItem>> {
    return this.http.get<ApiResult<AlreadyAssignedItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Assigned_Stock_Items_By_UserId}${userId}`);
  }

  GetDisposedStockItemsByUserId(userId: number): Observable<ApiResult<AlreadyAssignedItem>> {
    return this.http.get<ApiResult<AlreadyAssignedItem>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Get_Disposed_Stock_Items_By_UserId}${userId}`);
  }

  DisposeStockItemById(stockItemId: number): Observable<ApiResult<number>> {
    return this.http.patch<ApiResult<number>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Dispose_Stock_Item_By_Id}${stockItemId}`, null);
  }

  DisposeBulkFromStockMasterByIdArray(stockItemId: number[]): Observable<ApiResult<number>> {
    return this.http.patch<ApiResult<number>>(`${ApiUrl.baseApiUrl}${ApiUrl.stock.Dispose_Bulk_From_Stock_Master_By_Id_Array}`, stockItemId);
  }
  //#endregion
}