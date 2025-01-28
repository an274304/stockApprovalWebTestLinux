import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { VendorBillTableService } from '../../../services/vendor-bill-table.service';
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
import { GenerateOrderReceiptService } from '../../../../shared/services/generate-order-receipt.service';
declare var $: any;

@Component({
  selector: 'app-approved-bill',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './approved-bill.component.html',
  styleUrl: './approved-bill.component.css'
})
export class ApprovedBillComponent {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  purchaseItemApiResult: ApiResult<PurchaseItem> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  popTableList: PurchaseItem[] = [];

  constructor(private vendorBillTableService: VendorBillTableService,
    private generateOrderReceipt : GenerateOrderReceiptService
  ) { }

  ngOnInit(): void {
    this.loadApprovedBillTable();
  }

  private loadApprovedBillTable(): void {
    this.vendorBillTableService.GetApprovedBillAtDirector().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
        console.log(this.tableListApiResult);
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

  onClickGetApprovedItemByOrderNo(PurchaseOrderNo: string) {
    // Clear previous content 

    this.vendorBillTableService.GetApprovedItemByOrderNo(PurchaseOrderNo).subscribe({
        next: (response: ApiResult<PurchaseItem>) => {
            if (response.result) {
                this.purchaseItemApiResult = response;
                this.popTableList = this.purchaseItemApiResult.dataList ?? [];

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

                $('#ApprovedOrderitemPop').modal('show');
            } else {
                $('#ApprovedOrderitemPop .modal-body').html('<h1 class="text-danger">No Items Found!</h1>');
                $('#ApprovedOrderitemPop').modal('show');
            }
        },
        error: (err: any) => {
            console.error('Error fetching table data', err);
            this.purchaseItemApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
            $('#ApprovedOrderitemPop .modal-body').html('<h1 class="text-danger">Error fetching data!</h1>');
            $('#ApprovedOrderitemPop').modal('show');
        }
    });
}

downloadPurchaseOrder(purchaseOrderNo : string){
  this.generateOrderReceipt.Generate_PurchaseOrder(purchaseOrderNo);
}

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#ApprovedBillTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#ApprovedBillTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
