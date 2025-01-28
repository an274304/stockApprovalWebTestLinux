import { inject, Injectable } from '@angular/core';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { ApiUrl } from '../../core/Constant/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class VendorBillAccountService {
  http = inject(HttpClient);
  
  constructor() { }

  GetViewPendingBillAtAccount(purchaseOrderNo: string): Observable<ApiResult<PurchaseOrderWitItems>> {
    return this.http.get<ApiResult<PurchaseOrderWitItems>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Get_Received_Items_For_Update}${purchaseOrderNo}`);
  }

  UploadPayedReceiptForBill(form: FormData): Observable<ApiResult<Object>> {
    return this.http.patch<ApiResult<Object>>(`${ApiUrl.baseApiUrl}${ApiUrl.purchase.Upload_Payed_Receipt_For_Bill}`, form);
  }
}
