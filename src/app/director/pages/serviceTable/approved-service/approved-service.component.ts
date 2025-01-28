import { Component } from '@angular/core';
import { ServiceOrder } from '../../../../core/Models/ServiceOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ServiceTableDirectorMngService } from '../../../services/service-table-director-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpClient } from '@angular/common/http';
import { ServiceItem } from '../../../../core/Models/ServiceItem';
import { CommonModule, DatePipe } from '@angular/common';
import { GenerateOrderReceiptService } from '../../../../shared/services/generate-order-receipt.service';
declare var $ :any;

@Component({
  selector: 'app-approved-service',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './approved-service.component.html',
  styleUrl: './approved-service.component.css'
})
export class ApprovedServiceComponent {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  serviceItemApiResult: ApiResult<ServiceItem> = { dataList: [], result: false, message: 'Connection Not Available.' };


  hasData: boolean = false;
  popTableList: ServiceItem[] = [];

  constructor(
    private serviceDirectorTableService: ServiceTableDirectorMngService,
    private sweetAlert : SweetAlertService,
    private generateOrderReceipt : GenerateOrderReceiptService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadApprovedServiceTable();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  loadApprovedServiceTable(): void {
    this.serviceDirectorTableService.GetServiceApprovedAtDirector().subscribe({
      next: (response: ApiResult<ServiceOrder>) => {
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

  onClickApprovedItemByOrderNo(ServiceOrderNo: string) {
    // Clear previous content 
    this.serviceDirectorTableService.GetServiceApprovedItemByOrderNo(ServiceOrderNo).subscribe({
      next: (response: ApiResult<ServiceItem>) => {
        if (response.result) {
          this.serviceItemApiResult = response;
          this.popTableList = this.serviceItemApiResult.dataList ?? [];

          // Update the modal body with new content
          $('#ApprovedOrderitemPop .modal-body').html(`
                    <table class="table">
                        <thead>
                            <tr>
                               <th>Sn.</th>
                                <th>Item Name</th>
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
                                        <td>${item.itemRate}</td>
                                        <td>${item.itemQty}</td>
                                        <td>${(item.itemQty ?? 0) * (item.itemRate ?? 0)}</td>
                                    </tr>
                                `).join('')
              : '<tr><td colspan="3" class="text-danger">No Items Found!</td></tr>'
            }
                        </tbody>
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
        this.serviceItemApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
        $('#ApprovedOrderitemPop .modal-body').html('<h1 class="text-danger">Error fetching data!</h1>');
        $('#ApprovedOrderitemPop').modal('show');
      }
    });
  }

  downloadServiceOrder(serviceOrderNo : string){
    this.generateOrderReceipt.Generate_ServiceOrder(serviceOrderNo);
  }

  formatDate = (dateString : Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  
  initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          const table = $('#ApprovalPendingTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            destroy: true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#ApprovalPendingTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
