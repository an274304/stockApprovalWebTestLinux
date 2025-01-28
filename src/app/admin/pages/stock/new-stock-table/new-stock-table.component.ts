import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { StockMngService } from '../../../services/stock-mng.service';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-new-stock-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './new-stock-table.component.html',
  styleUrl: './new-stock-table.component.css'
})
export class NewStockTableComponent {
  hasData : Boolean = false;
  tableDataApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  tableData : PurchaseOrder[] = [];

  constructor(private stockMngService : StockMngService, 
    private router:Router,
    private sweetAlert : SweetAlertService){
    this.loadTableData();
  }

  loadTableData(){
    this.stockMngService.GetNewStockAtAdmin().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        if (response.result) {
          this.tableDataApiResult = response ?? null;
          this.tableData = this.tableDataApiResult.dataList ?? [];
          this.hasData = !!this.tableDataApiResult.dataList?.length;
        }
        else {
          this.hasData = false;   
 this.sweetAlert.toast('Fail To Save', 'warning');
        }

      },
      error: (err) => {
        console.error('Error fetching Users', err);
      }
    });
  }

  viewNewStockItems(purchaseOrderNo:string){
        if(purchaseOrderNo){
            this.router.navigate(['/admin/new-stock-view-form', purchaseOrderNo]);
        }
  }
}
