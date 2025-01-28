import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { PurchaseTableMngService } from '../../../services/purchase-table-mng.service';
import { Router } from '@angular/router';
import { GenerateOrderReceiptService } from '../../../../shared/services/generate-order-receipt.service';
import { GlobalStateService } from '../../../../shared/services/global-state.service';
declare var $: any; // Declare jQuery globally

@Component({
  selector: 'app-get-waiting-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-waiting-order-at-admin.component.html',
  styleUrl: './get-waiting-order-at-admin.component.css'
})
export class GetWaitingOrderAtAdminComponent implements AfterViewInit, OnInit{

  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  hasData: boolean = false;
  userRole : string = '';

  constructor(
    private purchaseTableService: PurchaseTableMngService,
    private generateOrderReceiptService: GenerateOrderReceiptService,
    private router: Router,
    private globalState: GlobalStateService
  ) {}

  ngOnInit(): void {
    this.userRole = this.globalState.getUserRole() || '';
    this.loadWaitTable();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

 private loadWaitTable(): void {
    this.purchaseTableService.GetWaitingOrderAtAdmin().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
        this.hasData = !!this.tableListApiResult.dataList?.length;
        this.initializeDataTable(); // Initialize DataTable after data is loaded
      },
      error: (err) => {
        console.error('Error fetching table data', err);
        this.tableListApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
        this.hasData = false;
      }
    });
  }

  initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          const table = $('#WaitTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            destroy: true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#WaitTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }

  viewReceivedItems(purchaseOrderNo : string){
    if(purchaseOrderNo){
        // Navigate to the received items component, passing the purchaseOrderNo as a parameter
        this.router.navigate(['/admin/view-Received-Items-Form', purchaseOrderNo]);
    }
  }

  downloadPurchaseOrder(purchaseOrderNo : string){
    this.generateOrderReceiptService.Generate_PurchaseOrder(purchaseOrderNo);
  }
}
