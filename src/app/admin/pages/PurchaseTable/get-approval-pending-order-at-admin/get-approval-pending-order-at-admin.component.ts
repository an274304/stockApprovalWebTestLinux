import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PurchaseTableMngService } from '../../../services/purchase-table-mng.service';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
import { VendorBillTableService } from '../../../../director/services/vendor-bill-table.service';
declare var $: any; // Declare jQuery globally
// Import DataTables related types and functionalities if using Angular DataTables

@Component({
  selector: 'app-get-approval-pending-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-approval-pending-order-at-admin.component.html',
  styleUrls: ['./get-approval-pending-order-at-admin.component.css']
})
export class GetApprovalPendingOrderAtAdminComponent implements AfterViewInit, OnInit {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  popTableList: PurchaseItem[] = [];
  hasData: boolean = false;

  constructor(private purchaseTableService: PurchaseTableMngService,
    private vendorBillTableService: VendorBillTableService
  ) { }

  ngOnInit(): void {
    this.loadApprovalPendingTable();
  }

  private loadApprovalPendingTable(): void {
    this.purchaseTableService.GetApprovalPendingOrderAtAdmin().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
        // Explicitly ensure hasData is a boolean
        this.hasData = !!this.tableListApiResult.dataList?.length;
        this.initializeDataTable(); // Initialize DataTable after data is loaded
      },
      error: (err) => {
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

  onClickGetApprovedPendingItemByOrderNo(PurchaseOrderNo: string) {
    // Clear previous content 

    this.vendorBillTableService.GetApprovedPendingItemByOrderNo(PurchaseOrderNo).subscribe({
      next: (response: ApiResult<PurchaseItem>) => {
        if (response.result) {

          this.popTableList = response.dataList ?? [];

          // Calculate the grand total
          let grandTotal = this.popTableList.reduce((sum, item) => {
            return sum + ((item.itemQty ?? 0) * (item.itemRate ?? 0));
          }, 0);

          // Update the modal body with new content
          $('#ApprovedOrderitemPop .modal-body').html(`
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Sn.</th>
                                <th>Item Name</th>
                                <th>Remark</th>
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

          $('#ApprovedOrderitemPop').modal('show');
        } else {
          $('#ApprovedOrderitemPop .modal-body').html('<h1 class="text-danger">No Items Found!</h1>');
          $('#ApprovedOrderitemPop').modal('show');
        }
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        $('#ApprovedOrderitemPop .modal-body').html('<h1 class="text-danger">Error fetching data!</h1>');
        $('#ApprovedOrderitemPop').modal('show');
      }
    });
  }

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#ApprovalPendingTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#ApprovalPendingTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
