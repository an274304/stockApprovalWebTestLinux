import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { PurchaseTableMngService } from '../../../services/purchase-table-mng.service';
declare var $: any; // Declare jQuery globally

@Component({
  selector: 'app-get-rejected-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-rejected-order-at-admin.component.html',
  styleUrl: './get-rejected-order-at-admin.component.css'
})
export class GetRejectedOrderAtAdminComponent {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  purchaseTableService = inject(PurchaseTableMngService);

  ngOnInit(): void {
    this.loadRejectedTable();
  }

 private loadRejectedTable(): void {
    this.purchaseTableService.GetRejectedOrderAtAdmin().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.tableListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(function() {
        var table = $('#RejectedTable').DataTable( {
          lengthChange: false,
          buttons: [ 'copy', 'excel', 'pdf', 'print']
        } );
       
        table.buttons().container()
          .appendTo( '#RejectedTable_wrapper .col-md-6:eq(0)' );
      } );
    } else {
      console.log('jQuery is not loaded');
    }
  }
}
