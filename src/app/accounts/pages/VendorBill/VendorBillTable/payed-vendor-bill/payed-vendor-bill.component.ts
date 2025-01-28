import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { PurchaseOrder } from '../../../../../core/Models/PurchaseOrder';
import { ApiResult } from '../../../../../core/DTOs/ApiResult';
import { VendorBillTableAccountService } from '../../../../services/vendor-bill-table-account.service';
import { Router } from '@angular/router';
import { PurchaseOrderWitItems } from '../../../../../core/DTOs/PurchaseOrderWitItems';
import { GenerateOrderReceiptService } from '../../../../../shared/services/generate-order-receipt.service';
import { PurchaseItem } from '../../../../../core/Models/PurchaseItem';
declare var $: any;

@Component({
  selector: 'app-payed-vendor-bill',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './payed-vendor-bill.component.html',
  styleUrl: './payed-vendor-bill.component.css'
})
export class PayedVendorBillComponent {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  orderDetailApiResult: ApiResult<PurchaseOrderWitItems> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  hasDataForItem: boolean = false;
  purchaseOrder? : PurchaseOrder;
  purchaseItem: PurchaseItem[] = [];  
  
  constructor(private vendorBillTableAccountService: VendorBillTableAccountService, 
    private router:Router,
    private generateOrderReceipt : GenerateOrderReceiptService
  ) {}

  ngOnInit(): void {
    this.loadPayedBillTable();
  }

  private loadPayedBillTable(): void {
    this.vendorBillTableAccountService.GetPayedBillAtAccount().subscribe({
      next: (response: ApiResult<PurchaseOrder>) => {
        this.tableListApiResult = response;
        console.log(this.tableListApiResult.dataList);
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

  viewOrderBillDetail(purchaseOrderNo : string){
      if(purchaseOrderNo){
        this.vendorBillTableAccountService.viewOrderBillDetailAtAccount(purchaseOrderNo).subscribe({
          next: (response: ApiResult<PurchaseOrderWitItems>) => {
            if(response.result){
              this.orderDetailApiResult = response;
              
              // Explicitly ensure hasDataForItem is a boolean
              this.hasDataForItem = !!this.orderDetailApiResult.data?.purchaseItems?.length; 
              this.purchaseOrder = this.orderDetailApiResult.data?.purchaseOrder as PurchaseOrder;
              this.purchaseItem = this.orderDetailApiResult.data?.purchaseItems as PurchaseItem[];

              $('#ViewOrderDetailPop').modal('show');
            }
            else{
              $('#ViewOrderDetailPop').modal('show');
            }
          },
          error: (err: any) => {
            console.error('Error fetching table data', err);
            this.orderDetailApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
            this.hasDataForItem = false; 
          }
        });
      }
  }

  downloadPurchaseOrder(purchaseOrderNo : string){
    this.generateOrderReceipt.Generate_PurchaseOrder(purchaseOrderNo);
  }

  // Add this method to calculate the Grand Total
calculateGrandTotal(): number {
  return this.purchaseItem.reduce((total, item) => total + ((item.itemQty ?? 0) * (item.itemRate ?? 0)), 0);
}

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#PayedBillTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#PayedBillTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
