import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceOrder } from '../../../../core/Models/ServiceOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ServiceTableDirectorMngService } from '../../../services/service-table-director-mng.service';
import { Router } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-pending-service',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pending-service.component.html',
  styleUrl: './pending-service.component.css'
})
export class PendingServiceComponent {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  hasData: boolean = false;
  
  constructor(private serviceTableDirectorMng: ServiceTableDirectorMngService, private router:Router) {}

  ngOnInit(): void {
    this.loadPendingTable();
  }

  private loadPendingTable(): void {
    this.serviceTableDirectorMng.GetServicePendingAtDirector().subscribe({
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
  
  viewOrderForApproval(serviceOrderNo : string){
    if(serviceOrderNo){
      // Navigate to the received items component, passing the serviceOrderNo as a parameter
      this.router.navigate(['/director/view-service-pending', serviceOrderNo]);
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
          var table = $('#PendingServiceTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            "destroy": true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#PendingServiceTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
