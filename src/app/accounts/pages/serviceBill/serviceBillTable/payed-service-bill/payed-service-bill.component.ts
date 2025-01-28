import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceOrder } from '../../../../../core/Models/ServiceOrder';
import { ServiceItem } from '../../../../../core/Models/ServiceItem';
import { ApiResult } from '../../../../../core/DTOs/ApiResult';
import { ServiceTableMngService } from '../../../../../admin/services/service-table-mng.service';
import { ServiceTableDirectorMngService } from '../../../../../director/services/service-table-director-mng.service';
import { SweetAlertService } from '../../../../../shared/services/sweet-alert.service';
import { HttpClient } from '@angular/common/http';
import { ServiceBillTableAccountService } from '../../../../services/service-bill-table-account.service';
import { GenerateOrderReceiptService } from '../../../../../shared/services/generate-order-receipt.service';
declare var $: any;

@Component({
  selector: 'app-payed-service-bill',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './payed-service-bill.component.html',
  styleUrl: './payed-service-bill.component.css'
})
export class PayedServiceBillComponent {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  serviceItemApiResult: ApiResult<ServiceItem> = { dataList: [], result: false, message: 'Connection Not Available.' };


  hasData: boolean = false;
  popTableList: ServiceItem[] = [];

  constructor(
    private serviceTableDirectorMng: ServiceTableDirectorMngService,
    private ServiceBillTableAccountService: ServiceBillTableAccountService,
    private generateOrderReceipt : GenerateOrderReceiptService,
    private sweetAlert: SweetAlertService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadServicePayedTable();
    //this.loadBranches();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  loadServicePayedTable(): void {
    this.ServiceBillTableAccountService.GetServicePayedBillAtAccount().subscribe({
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
    this.serviceTableDirectorMng.GetServiceApprovedItemByOrderNo(ServiceOrderNo).subscribe({
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

  formatDate = (dateString: Date) => {
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
          const table = $('#PayedTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            destroy: true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#PayedTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
