import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PurchaseOrder } from '../../../../core/Models/PurchaseOrder';
import { PurchaseTableMngService } from '../../../services/purchase-table-mng.service';
import { ApiResult } from '../../../../core/DTOs/ApiResult';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseMngService } from '../../../services/purchase-mng.service';
import { VendorMaster } from '../../../../core/Models/VendorMaster';
import { BranchMaster } from '../../../../core/Models/BranchMaster';
import { BranchMngService } from '../../../services/branch-mng.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
declare var $: any; // Declare jQuery globally
import { PurchaseItem } from '../../../../core/Models/PurchaseItem';
import { VendorBillTableService } from '../../../../director/services/vendor-bill-table.service';
import { SweetAlertService } from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-get-approved-order-at-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './get-approved-order-at-admin.component.html',
  styleUrls: ['./get-approved-order-at-admin.component.css']
})
export class GetApprovedOrderAtAdminComponent implements AfterViewInit, OnInit {
  tableListApiResult: ApiResult<PurchaseOrder> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorSendApiResult: ApiResult<Object> = { dataList: [], result: false, message: 'Connection Not Available.' };
  vendorListByPurchaseOrderNo_ApiResult: ApiResult<VendorMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  branchListApiResult: ApiResult<BranchMaster> = { dataList: [], result: false, message: 'Connection Not Available.' };
  purchaseItemApiResult: ApiResult<PurchaseItem> = { dataList: [], result: false, message: 'Connection Not Available.' };

  hasData: boolean = false;
  selectedPurchaseOrderNo?: string;
  purchaseOrderApproveBy?: string;
  filteredBranches: BranchMaster[] = [];
  popTableList: PurchaseItem[] = [];

  constructor(
    private purchaseTableService: PurchaseTableMngService,
    private purchaseService: PurchaseMngService,
    private branchService: BranchMngService,
    private vendorBillTableService: VendorBillTableService,
    private sweetAlert : SweetAlertService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadApprovedTable();
    //this.loadBranches();
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  SelectVendorWiseAddress(purchaseOrderNo?: string, orderApproveBy?: string): void {
    if (purchaseOrderNo) {

      this.purchaseService.GetVendorDtlsByPurchaseOrderNo(purchaseOrderNo).subscribe({
        next: (response: ApiResult<VendorMaster>) => {

          if (response.result) {
            this.selectedPurchaseOrderNo = purchaseOrderNo;
            this.purchaseOrderApproveBy = orderApproveBy;
            this.vendorListByPurchaseOrderNo_ApiResult = response;
            this.loadBranches();
            this.loadPurchaseItem(purchaseOrderNo);
            $('#VendorWiseAddressPop').modal('show');
          }

        },
        error: (err) => {
          console.error('Error fetching Vendor List data', err);
          this.vendorListByPurchaseOrderNo_ApiResult = { dataList: [], result: false, message: 'Error fetching Vendor List data' };
        }
      });

    } else {
      this.sweetAlert.message('Purchase Order Number Is Null', 'warning');
    }
  }

  async startDownload() {
    // Check if there are vendors and branches selected
    if (!this.vendorListByPurchaseOrderNo_ApiResult.dataList || this.vendorListByPurchaseOrderNo_ApiResult.dataList.length === 0) {
      this.sweetAlert.toast('No Vendors Available To Send', 'warning');
      return;
    }

    if (!this.isSelectedAllShippingAddress()) {
      this.sweetAlert.toast('Select All Shipping Address', 'warning');
      return;
    }

    const purchaseOrderDetails = this.vendorListByPurchaseOrderNo_ApiResult.dataList.map((vendor, index) => {
      const selectedBranchElement = document.querySelector(`#VendorWiseAddressPop tbody tr:nth-child(${index + 1}) select`) as HTMLSelectElement;
      const selectedBranchId = selectedBranchElement?.value ? parseInt(selectedBranchElement.value) : null;
    
      // Find the selected branch object from filteredBranches
      const selectedBranch = this.filteredBranches.find(branch => branch.id === selectedBranchId);
    
      return {
        vendor: vendor,
        Branch: selectedBranch, // Return the entire selected branch object
        items: this.popTableList.filter(item => item.venId === vendor.id),
        approveBy : this.purchaseOrderApproveBy
      };
    }).filter(Boolean);  // Filter out any null results if a branch wasn't selected

    if (purchaseOrderDetails.length === 0) {
      return;
    }

    // Call the async function to fetch and generate the report
    await this.generateReport(purchaseOrderDetails, this.selectedPurchaseOrderNo);

    // Proceed with sending to vendor after the report is generated
    this.sendToVendor();
  }


  async generateReport(purchaseOrderDetails: any[], purchaseOrderNo?: string): Promise<void> {
    try {
      const template = await firstValueFrom(this.http.get('/assets/templates/purchase-order.html', { responseType: 'text' }));
      let grandTotalAmt = 0;

      if (!template) {
        throw new Error('Template not found or empty');
      }
  
      for (let i = 0; i < purchaseOrderDetails.length; i++) {
        const purchaseDetail = purchaseOrderDetails[i];
        const vendor = purchaseDetail.vendor;
        const items = purchaseDetail.items || [];
        const sign = purchaseDetail.approveBy ?? 'Signature Required';
       
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
          .replace('{purchaseOrderNo}', purchaseOrderNo ?? '####')
          .replace('{venShopName}', vendor.venShopName)
          .replace('{venAddress}', vendor.venAddress)
          .replace('{venMob}', vendor.venMob)
          .replace('{shipName}', 'Committed Cargo Care Limited')
          .replace('{shipAddress}', purchaseDetail.Branch.branchAddress)
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
        link.download = `Purchase_Order_${vendor.venShopName}.html`;
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
    if (this.selectedPurchaseOrderNo) {
      this.purchaseService.ItemsSendToVendor(this.selectedPurchaseOrderNo).subscribe({
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
      alert('Fail To Select Purchase Order');
    }
  }

  loadApprovedTable(): void {
    this.purchaseTableService.GetApprovedOrderAtAdmin().subscribe({
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

  loadPurchaseItem(purchaseOrderNo: string) {
    this.vendorBillTableService.GetApprovedItemByOrderNo(purchaseOrderNo).subscribe({
      next: (response: ApiResult<PurchaseItem>) => {
        if (response.result) {
          this.purchaseItemApiResult = response;
          this.popTableList = this.purchaseItemApiResult.dataList ?? [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching table data', err);
        this.purchaseItemApiResult = { dataList: [], result: false, message: 'Error fetching table data' };
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

  isSelectedAllShippingAddress(): boolean {
    return this.vendorListByPurchaseOrderNo_ApiResult?.dataList?.every((vendor, index) => {
      const selectedBranchElement = document.querySelector(`#VendorWiseAddressPop tbody tr:nth-child(${index + 1}) select`) as HTMLSelectElement;
      const selectedBranchId = selectedBranchElement?.value ? parseInt(selectedBranchElement.value) : null;
  
      // Check if all valid branches are selected
      return selectedBranchId !== null && selectedBranchId > 0;  // Ensure selectedBranchId is not null and greater than 0
    }) ?? true;  // If dataList is null or undefined, return true
  }
  
}

