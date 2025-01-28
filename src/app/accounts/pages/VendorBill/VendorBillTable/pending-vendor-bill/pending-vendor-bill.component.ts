import { Component } from '@angular/core';
import { VendorBillTableAccountService } from '../../../../services/vendor-bill-table-account.service';
import { Router } from '@angular/router';
import { PurchaseOrder } from '../../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../../core/DTOs/ApiResult';
import { CommonModule, DatePipe } from '@angular/common';
import { GenerateOrderReceiptService } from '../../../../../shared/services/generate-order-receipt.service';
declare var $: any;

@Component({
  selector: 'app-pending-vendor-bill',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pending-vendor-bill.component.html',
  styleUrl: './pending-vendor-bill.component.css'
})
export class PendingVendorBillComponent {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  hasData: boolean = false;
  
  constructor(private vendorBillTableAccountService: VendorBillTableAccountService, 
    private generateOrderReceipt : GenerateOrderReceiptService,
    private router:Router) {}

  ngOnInit(): void {
    this.loadPendingBillTable();
  }

  private loadPendingBillTable(): void {
    this.vendorBillTableAccountService.GetPendingBillAtAccount().subscribe({
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
  
  viewOrderForBill(purchaseOrderNo : string){
    if(purchaseOrderNo){
      // Navigate to the received items component, passing the purchaseOrderNo as a parameter
      this.router.navigate(['/account/pending', purchaseOrderNo]);
  }
  }

  downloadPurchaseOrder(purchaseOrderNo : string){
    this.generateOrderReceipt.Generate_PurchaseOrder(purchaseOrderNo);
  }

  ngAfterViewInit(): void {
    // Initialize DataTable after the view has been fully initialized
    this.initializeDataTable();
  }

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#PendingBillTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#PendingBillTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
