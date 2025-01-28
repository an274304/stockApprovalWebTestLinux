import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceOrder } from '../../../../../core/Models/ServiceOrder';
import { ApiResult } from '../../../../../core/DTOs/ApiResult';
import { Router } from '@angular/router';
import { ServiceBillTableAccountService } from '../../../../services/service-bill-table-account.service';
declare var $ : any;

@Component({
  selector: 'app-pending-service-bill',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pending-service-bill.component.html',
  styleUrl: './pending-service-bill.component.css'
})
export class PendingServiceBillComponent {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  hasData: boolean = false;
  
  constructor(private serviceBillTableAccount: ServiceBillTableAccountService, private router:Router) {}

  ngOnInit(): void {
    this.loadServicePendingBillTable();
  }

  private loadServicePendingBillTable(): void {
    this.serviceBillTableAccount.GetServicePendingBillAtAccount().subscribe({
      next: (response: ApiResult<ServiceOrder>) => {
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
  
  viewOrderForBill(ServiceOrderNo : string){
    if(ServiceOrderNo){
      // Navigate to the received items component, passing the ServiceOrderNo as a parameter
      this.router.navigate(['/account/service-pending', ServiceOrderNo]);
  }
  }

  ngAfterViewInit(): void {
    // Initialize DataTable after the view has been fully initialized
    this.initializeDataTable();
  }

  private initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          var table = $('#ServicePendingBillTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#ServicePendingBillTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
