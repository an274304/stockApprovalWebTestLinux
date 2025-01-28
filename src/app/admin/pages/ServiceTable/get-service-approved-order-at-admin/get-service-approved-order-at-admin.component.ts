import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ServiceTableMngService } from '../../../services/service-table-mng.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';
import { HttpClient } from '@angular/common/http';
import { ServiceOrder } from '../../../../core/Models/ServiceOrder';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { BranchMaster } from '../../../../core/Models/BranchMaster';
import { ServiceItem } from '../../../../core/Models/ServiceItem';
import { ServiceMngService } from '../../../services/service-mng.service';
import { BranchMngService } from '../../../services/branch-mng.service';
import { firstValueFrom } from 'rxjs';
import { ServiceTableDirectorMngService } from '../../../../director/services/service-table-director-mng.service';
declare var $: any;

@Component({
  selector: 'app-get-service-approved-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-service-approved-order-at-admin.component.html',
  styleUrl: './get-service-approved-order-at-admin.component.css'
})
export class GetServiceApprovedOrderAtAdminComponent implements AfterViewInit, OnInit {
  tableListApiResult: ApiResult<ServiceOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorSendApiResult: ApiResult<Object> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorListByServiceOrderNo_ApiResult: ApiResult<VendorMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  branchListApiResult: ApiResult<BranchMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  serviceItemApiResult: ApiResult<ServiceItem> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  selectedServiceOrderNo?: string;
  serviceOrderApproveBy?: string;
  filteredBranches: BranchMaster[] = [];
  popTableList: ServiceItem[] = [];


  constructor(
    private serviceTableService: ServiceTableMngService,
    private serviceService: ServiceMngService,
    private branchService: BranchMngService,
    private serviceTableDirectorService: ServiceTableDirectorMngService,
    private sweetAlert: SweetAlertService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadApprovedTable();
    //this.loadBranches();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  loadApprovedTable(): void {
    this.serviceTableService.GetServiceApprovedOrderAtAdmin().subscribe({
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

  SelectVendorWiseAddress(serviceOrderNo?: string, orderApproveBy?: string): void {
    if (serviceOrderNo) {

      this.serviceService.GetServiceVendorDtlsByserviceOrderNo(serviceOrderNo).subscribe({
        next: (response: ApiResult<VendorMaster>) => {

          if (response.result) {
            this.selectedServiceOrderNo = serviceOrderNo;
            this.serviceOrderApproveBy = orderApproveBy;
            this.vendorListByServiceOrderNo_ApiResult = response;
            this.loadBranches();
            this.loadserviceItem(serviceOrderNo);
            $('#VendorWiseAddressPop').modal('show');
          }

        },
        error: (err) => {
          console.error('Error fetching Vendor List data', err);
          this.vendorListByServiceOrderNo_ApiResult = { dataList: [], result: false, message: 'Error fetching Vendor List data' };
        }
      });

    } else {
      this.sweetAlert.message('service Order Number Is Null', 'warning');
    }
  }

  async startDownload() {
    // Check if there are vendors and branches selected
    if (!this.vendorListByServiceOrderNo_ApiResult.dataList || this.vendorListByServiceOrderNo_ApiResult.dataList.length === 0) {
      this.sweetAlert.toast('No Vendors Available To Send', 'warning');
      return;
    }

    if (!this.isSelectedAllShippingAddress()) {
      this.sweetAlert.toast('Select All Shipping Address', 'warning');
      return;
    }

    const serviceOrderDetails = this.vendorListByServiceOrderNo_ApiResult.dataList.map((vendor, index) => {
      const selectedBranchElement = document.querySelector(`#VendorWiseAddressPop tbody tr:nth-child(${index + 1}) select`) as HTMLSelectElement;
      const selectedBranchId = selectedBranchElement?.value ? parseInt(selectedBranchElement.value) : null;

      // Find the selected branch object from filteredBranches
      const selectedBranch = this.filteredBranches.find(branch => branch.id === selectedBranchId);

      return {
        vendor: vendor,
        Branch: selectedBranch, // Return the entire selected branch object
        items: this.popTableList.filter(item => item.venId === vendor.id),
        approveBy: this.serviceOrderApproveBy
      };
    }).filter(Boolean);  // Filter out any null results if a branch wasn't selected

    if (serviceOrderDetails.length === 0) {
      return;
    }

    // Call the async function to fetch and generate the report
    await this.generateReport(serviceOrderDetails, this.selectedServiceOrderNo);
    
    // Proceed with sending to vendor after the report is generated
    this.sendToVendor();
  }


  async generateReport(serviceOrderDetails: any[], serviceOrderNo?: string): Promise<void> {
    try {
      const template = await firstValueFrom(this.http.get('/assets/templates/service-order.html', { responseType: 'text' }));
      let grandTotalAmt = 0;

      if (!template) {
        throw new Error('Template not found or empty');
      }

      for (let i = 0; i < serviceOrderDetails.length; i++) {
        const serviceDetail = serviceOrderDetails[i];
        const vendor = serviceDetail.vendor;
        const items = serviceDetail.items || [];
        const sign = serviceDetail.approveBy ?? 'Signature Required';

        let table = '';

        items.forEach((item: any, index: number) => {
          grandTotalAmt += (item.itemRate ?? 0) * (item.itemQty ?? 0);

          table += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.proName}</td>
              <td>${item.itemRate}</td>
              <td>${item.itemQty}</td>
              <td>${(item.itemRate ?? 0) * (item.itemQty ?? 0)}</td>
            </tr>
          `;
        });

        table += `
        <tr>
          <td colspan='4' style='text-align:end!important;'><strong>Grand Total :</strong> </td>
          <td>{grandTotalAmt}</td>
        </tr>
       `;

        let populatedTemplate = template
          .replace('{currentDate}', this.formatDate(new Date()))
          .replace('{serviceOrderNo}', serviceOrderNo ?? '####')
          .replace('{venShopName}', vendor.venShopName)
          .replace('{venAddress}', vendor.venAddress)
          .replace('{venMob}', vendor.venMob)
          .replace('{shipName}', 'Committed Cargo Care Limited')
          .replace('{shipAddress}', serviceDetail.Branch.branchAddress)
          .replace('{shipMob}', '+91 11 4615 1111')
          .replace('{table}', table || 'Something Went Wrong...')
          .replace('{grandTotalAmt}', grandTotalAmt.toString())
          .replace('{sign}', sign);

        // Create a Blob from the populated template
        const blob = new Blob([populatedTemplate], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `service_Order_${vendor.venShopName}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
      }
    } catch (error) {
      console.error('Error generating reports', error);
      throw error;
    }
  }

  sendToVendor() {
    if (this.selectedServiceOrderNo) {
      this.serviceService.serviceItemsSendToVendor(this.selectedServiceOrderNo).subscribe({
        next: (response: ApiResult<Object>) => {
          this.vendorSendApiResult = response;
          if (this.vendorSendApiResult.result) {
            this.sweetAlert.toast('Successfully Sent To Vendor', 'success');
            // Reload the table data after a successful operation
            this.loadApprovedTable();
            this.loadBranches();
          } else {
            this.sweetAlert.toast('Failed To Send To Vendor', 'warning');
          }
        },
        error: (err) => {
          console.error('Error sending item to vendor', err);
        }
      });
    }
    else {
      alert('Fail To Select service Order');
    }
  }

  loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (response: ApiResult<BranchMaster>) => {
        this.branchListApiResult = response;
        this.filteredBranches = response.dataList ?? [];
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        this.branchListApiResult = { dataList: [], result: false, message: 'Error fetching categories' };
        this.filteredBranches = [];
      }
    });
  }

  loadserviceItem(serviceOrderNo: string) {
    this.serviceTableDirectorService.GetServiceApprovedItemByOrderNo(serviceOrderNo).subscribe({
      next: (response: ApiResult<ServiceItem>) => {
        if (response.result) {
          this.serviceItemApiResult = response;
          this.popTableList = this.serviceItemApiResult.dataList ?? [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.serviceItemApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
      }
    });
  }

  isSelectedAllShippingAddress(): boolean {
    return this.vendorListByServiceOrderNo_ApiResult?.dataList?.every((vendor, index) => {
      const selectedBranchElement = document.querySelector(`#VendorWiseAddressPop tbody tr:nth-child(${index + 1}) select`) as HTMLSelectElement;
      const selectedBranchId = selectedBranchElement?.value ? parseInt(selectedBranchElement.value) : null;

      // Check if all valid branches are selected
      return selectedBranchId !== null && selectedBranchId > 0;  // Ensure selectedBranchId is not null and greater than 0
    }) ?? true;  // If dataList is null or undefined, return true
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
          const table = $('#ApprovedTable').DataTable({
            lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print'],
            destroy: true // Ensure DataTable is reinitialized correctly
          });
          table.buttons().container()
            .appendTo('#ApprovedTable_wrapper .col-md-6:eq(0)');
        }
      });
    }
  }
}
