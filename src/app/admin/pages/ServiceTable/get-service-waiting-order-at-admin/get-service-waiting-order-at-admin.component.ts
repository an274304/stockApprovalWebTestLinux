import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { ServiceOrder } from '../../../../core/Models/ServiceOrder';
import { ServiceTableMngService } from '../../../services/service-table-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpClient } from '@angular/common/http';
import { ServiceTableDirectorMngService } from '../../../../director/services/service-table-director-mng.service';
import { ServiceItem } from '../../../../core/Models/ServiceItem';
import { ServiceMngService } from '../../../services/service-mng.service';
import { GenerateOrderReceiptService } from '../../../../shared/services/generate-order-receipt.service';
declare var $: any;

@Component({
  selector: 'app-get-service-waiting-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-service-waiting-order-at-admin.component.html',
  styleUrl: './get-service-waiting-order-at-admin.component.css'
})
export class GetServiceWaitingOrderAtAdminComponent {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  serviceItemApiResult: ApiResult<ServiceItem> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  popTableList: ServiceItem[] = [];
  
  constructor(
    private serviceTable: ServiceTableMngService,
    private serviceDirectorTable: ServiceTableDirectorMngService,
    private serviceMng: ServiceMngService,
    private generateOrderReceipt : GenerateOrderReceiptService,
    private sweetAlert : SweetAlertService
  ) { }

  ngOnInit(): void {
    this.loadWaitingTable();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  loadWaitingTable(): void {
    this.serviceTable.GetServiceWaitingOrderAtAdmin().subscribe({
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

  formatDate = (dateString : Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  
  serviceItemsSendToCompleted(serviceOrderNo : string) {
      this.serviceMng.SERVICE_ITEMS_SEND_TO_COMPLETED(serviceOrderNo).subscribe({
        next: (response: ApiResult<Object>) => {
          if (response.result) {
            this.sweetAlert.toast('Successfully Sent To Completed', 'success');
            // Reload the table data after a successful operation
            this.loadWaitingTable();
           
          } else {
            this.sweetAlert.toast('Failed To Send To Completed', 'warning');
          }
        },
        error: (err) => {
          console.error('Error sending item to Completed', err);
        }
      });
  }

  downloadServiceOrder(purchaseOrderNo : string){
    this.generateOrderReceipt.Generate_ServiceOrder(purchaseOrderNo);
  }

  onClickApprovedItemByOrderNo(ServiceOrderNo: string) {
    // Clear previous content 
    this.serviceDirectorTable.GetServiceApprovedItemByOrderNo(ServiceOrderNo).subscribe({
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

  initializeDataTable(): void {
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        if (this.hasData) {
          const table = $('#WaitingTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            destroy: true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#WaitingTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
