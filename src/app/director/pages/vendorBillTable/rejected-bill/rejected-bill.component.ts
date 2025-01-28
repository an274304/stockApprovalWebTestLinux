import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { VendorBillTableService } from '../../../services/vendor-bill-table.service';
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
declare var $: any;

@Component({
  selector: 'app-rejected-bill',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './rejected-bill.component.html',
  styleUrl: './rejected-bill.component.css'
})
export class RejectedBillComponent {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  purchaseItemApiResult: ApiResult<PurchaseItem> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  popTableList: PurchaseItem[] = [];

  constructor(private vendorBillTableService: VendorBillTableService) { }

  ngOnInit(): void {
    this.loadRejectedBillTable();
  }

  private loadRejectedBillTable(): void {
    this.vendorBillTableService.GetRejectedBillAtDirector().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
        // Explicitly ensure hasData is a boolean
        this.hasData = !!this.tableListApiResult.dataList?.length;
        this.initializeDataTable(); // Initialize DataTable after data is loaded
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.tableListApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
        this.hasData = false; // Ensure hasData is set to false on error
      }
    });
  }


  ngAfterViewInit(): void {
    // Initialize DataTable after the view has been fully initialized
    this.initializeDataTable();
  }

  onClickGetRejectedItemByOrderNo(PurchaseOrderNo: string) {
    // Clear previous content 
    this.vendorBillTableService.GetRejectedItemByOrderNo(PurchaseOrderNo).subscribe({
      next: (response: ApiResult<PurchaseItem>) => {
        if (response.result) {
          this.purchaseItemApiResult = response;
          this.popTableList = this.purchaseItemApiResult.dataList ?? [];

             // Calculate the grand total
             let grandTotal = this.popTableList.reduce((sum, item) => {
              return sum + ((item.itemQty ?? 0) * (item.itemRate ?? 0));
            }, 0);

          // Update the modal body with new content
          $('#RejectedOrderitemPop .modal-body').html(`
                    <table class="table">
                        <thead>
                            <tr>
                               <th>Sn.</th>
                                <th>Item Name</th>
                                 <th>Item Remark</th>
                                <th>Rate</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.popTableList.length > 0
              ? this.popTableList.map((item, index) => `
                                    <tr>
                                         <td>${index + 1}</td>
                                        <td>${item.proName}</td>
                                        <td>${item.itemRemark}</td>
                                        <td>${item.itemRate}</td>
                                        <td>${item.itemQty}</td>
                                        <td>${((item.itemQty ?? 0) * (item.itemRate ?? 0)).toFixed(1)}</td>
                                    </tr>
                                `).join('')
              : '<tr><td colspan="3" class="text-danger">No Items Found!</td></tr>'
            }
                        </tbody>
                            <tfoot>
            <tr>
                <td colspan="5" style="text-align:right!important;"><strong>Grand Total : </strong></td>
                <td><strong>${grandTotal.toFixed(1)}</strong></td>
            </tr>
        </tfoot>
                    </table>
                `);

          $('#RejectedOrderitemPop').modal('show');
        } else {
          $('#RejectedOrderitemPop .modal-body').html('<h1 class="text-danger">No Items Found!</h1>');
          $('#RejectedOrderitemPop').modal('show');
        }
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.purchaseItemApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
        $('#RejectedOrderitemPop .modal-body').html('<h1 class="text-danger">Error fetching data!</h1>');
        $('#RejectedOrderitemPop').modal('show');
      }
    });
  }

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#RejectedBillTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#RejectedBillTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
