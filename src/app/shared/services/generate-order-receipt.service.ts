import { Injectable } from '@angular/core';
import { PurchaseMngService } from '../../admin/services/purchase-mng.service';
import { VendorMaster } from '../../core/Models/VendorMaster';
import { ApiResult } from '../../core/DTOs/ApiResult';
import { PurchaseItem } from '../../core/Models/PurchaseItem';
import { BranchMaster } from '../../core/Models/BranchMaster';
import { BranchMngService } from '../../admin/services/branch-mng.service';
import { PurchaseOrderWitItems } from '../../core/DTOs/PurchaseOrderWitItems';
import { PurchaseOrder } from '../../core/Models/PurchaseOrder';
import { firstValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceMngService } from '../../admin/services/service-mng.service';
import { ServiceBillAccountService } from '../../accounts/services/service-bill-account.service';
import { ServiceOrderWithItemAndImage } from '../../core/DTOs/ServiceOrderWithItemAndImage';
import { ServiceOrder } from '../../core/Models/ServiceOrder';
import { ServiceItemWithImage } from '../../core/DTOs/ServiceItemWithImage';

@Injectable({
  providedIn: 'root'
})
export class GenerateOrderReceiptService {
  formDataApiResult: ApiResult<PurchaseOrderWitItems> = { data: undefined, result: false, message: 'Connection Not Available.' };
  formDataApiResultService: ApiResult<ServiceOrderWithItemAndImage> = { data: undefined, result: false, message: 'Connection Not Available.' };

  purchaseItem: PurchaseItem[] = [];
  serviceItemWithImage: ServiceItemWithImage[] = [];

  filteredBranches: BranchMaster[] = [];
  vendorList: VendorMaster[] = [];

  purchaseOrder: PurchaseOrder | undefined;
  serviceOrder: ServiceOrder | undefined;

  constructor(
    private purchaseService: PurchaseMngService,
    private branchService: BranchMngService,
    private serviceService: ServiceMngService,
    private serviceBillAccount: ServiceBillAccountService,
    private http: HttpClient
  ) { }


  //#region Purchase Order Receipt
  async Generate_PurchaseOrder(purchaseOrderNo: string): Promise<void> {
    try {
      // Wait for all data loading functions to finish before continuing
      await Promise.all([
        this.loadPurchaseOrderWithItems(purchaseOrderNo),
        this.loadPurchaseVendors(purchaseOrderNo),
        this.loadBranches()
      ]);

      // Once all data is loaded, call prepare_PurchaseOrder
      await this.prepare_PurchaseOrder();
    } catch (error) {
      console.error('Error generating purchase order:', error);
    }
  }

  private async loadPurchaseOrderWithItems(purchaseOrderNo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.purchaseService.GetReceivedItemsForUpdate(purchaseOrderNo).subscribe({
        next: (response: ApiResult<PurchaseOrderWitItems>) => {
          if (response.result) {
            this.formDataApiResult = response ?? null;
            this.purchaseItem = response.data?.purchaseItems ?? [];
            this.purchaseOrder = response.data?.purchaseOrder;
            resolve(); // Resolve once data is successfully loaded
          } else {
            reject('Failed to load purchase order with items.');
          }
        },
        error: (err) => {
          console.error('Error fetching Order-Item Details', err);
          reject(err);
        }
      });
    });
  }

  private async loadPurchaseVendors(purchaseOrderNo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.purchaseService.GetVendorDtlsByPurchaseOrderNo(purchaseOrderNo).subscribe({
        next: (response: ApiResult<VendorMaster>) => {
          if (response.result) {
            this.vendorList = response.dataList ?? [];
            resolve(); // Resolve once data is successfully loaded
          } else {
            reject('Failed to load vendor details.');
          }
        },
        error: (err) => {
          console.error('Error fetching Vendor Details', err);
          reject(err);
        }
      });
    });
  }
  private async prepare_PurchaseOrder() {
    const purchaseOrderDetails = this.vendorList.map((vendor) => {
      const selectedBranch = this.filteredBranches.find(branch => branch.id === 1);
      return {
        vendor: vendor,
        Branch: selectedBranch, // Ensure we handle undefined if no branch is found
        items: this.purchaseItem.filter(item => item.venId === vendor.id),
        approveBy: this.purchaseOrder?.orderApproveBy || 'Signature Required',
        approveByDate: this.purchaseOrder?.orderApproveDt || 'Signature Date Time Required',
        purchaseOrderDt: this.purchaseOrder?.purchaseOrderDt || null
      };
    }).filter(Boolean); // Ensure no empty objects are passed to the next stage

    if (purchaseOrderDetails.length > 0) {
      await this.generatePurchaseReport(purchaseOrderDetails, this.purchaseOrder?.purchaseOrderNo);
    } else {
      console.error('No purchase order details available for report generation.');
    }
  }
  private async generatePurchaseReport(purchaseOrderDetails: any[], purchaseOrderNo?: string): Promise<void> {
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
        const sign = purchaseDetail.approveBy;
        const signDt = purchaseDetail.approveByDate;

        let table = '';
        items.forEach((item: any, index: number) => {
          grandTotalAmt += (item.itemRate ?? 0) * (item.itemQty ?? 0);

          table += `
            <tr>
              <td>${index + 1}</td>
              <td>${item.proName}</td>
              <td>${item.itemRate}</td>
              <td>${item.itemQty}</td>
              <td>${((item.itemRate ?? 0) * (item.itemQty ?? 0)).toFixed(1)}</td>
            </tr>
          `;
        });

        table += `
        <tr>
          <td colspan='4' style='text-align:end!important;'><strong>Grand Total :</strong> </td>
          <td>${(grandTotalAmt).toFixed(1)}</td>
        </tr>
       `;

        let populatedTemplate = template
          .replace('{purchaseOrderDate}', this.formatDate(purchaseDetail.purchaseOrderDt ?? new Date()))
          .replace('{purchaseOrderNo}', purchaseOrderNo ?? '####')
          .replace('{venShopName}', vendor.venShopName || 'N/A')
          .replace('{venAddress}', vendor.venAddress || 'N/A')
          .replace('{venMob}', vendor.venMob || 'N/A')
          .replace('{shipName}', 'Committed Cargo Care Limited')
          .replace('{shipAddress}', purchaseDetail.Branch?.branchAddress || 'N/A')
          .replace('{shipMob}', '+91 11 4615 1111')
          .replace('{table}', table || 'Something Went Wrong...')
          .replace('{grandTotalAmt}', grandTotalAmt.toFixed(2))  // Ensure proper format for the total amount
          .replace('{sign}', sign)
          .replace('{signDt}', this.formatDate(signDt));

        const blob = new Blob([populatedTemplate], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

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
  //#endregion


  //#region Service Order Receipt
  async Generate_ServiceOrder(serviceOrderNo: string): Promise<void> {
    try {
      // Wait for all data loading functions to finish before continuing
      await Promise.all([
        this.loadServiceOrderWithItemsAndImages(serviceOrderNo),
        this.loadServiceVendors(serviceOrderNo),
        this.loadBranches()
      ]);

      // Once all data is loaded, call prepare_PurchaseOrder
      await this.prepare_ServiceOrder();
    } catch (error) {
      console.error('Error generating purchase order:', error);
    }
  }
  private async loadServiceOrderWithItemsAndImages(serviceOrderNo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serviceBillAccount.viewServiceOrderBillDetailAtAccount(serviceOrderNo).subscribe({
        next: (response: ApiResult<ServiceOrderWithItemAndImage>) => {
          if (response.result) {
            this.formDataApiResultService = response ?? null;
            this.serviceOrder = response.data?.serviceOrder;
            this.serviceItemWithImage = response.data?.serviceItemWithImages ?? [];
            resolve(); // Resolve once data is successfully loaded
          } else {
            reject('Failed to load service order with items.');
          }
        },
        error: (err) => {
          console.error('Error fetching Order-Item Details', err);
          reject(err);
        }
      });
    });
  }
  private async loadServiceVendors(serviceOrderNo: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serviceService.GetServiceVendorDtlsByserviceOrderNo(serviceOrderNo).subscribe({
        next: (response: ApiResult<VendorMaster>) => {
          if (response.result) {
            this.vendorList = response.dataList ?? [];
            resolve(); // Resolve once data is successfully loaded
          } else {
            reject('Failed to load service-vendor details.');
          }
        },
        error: (err) => {
          console.error('Error fetching service-Vendor Details', err);
          reject(err);
        }
      });
    });
  }
  private async prepare_ServiceOrder() {
    const serviceOrderDetails = this.vendorList.map((vendor) => {
      const selectedBranch = this.filteredBranches.find(branch => branch.id === 1);
      return {
        vendor: vendor,
        Branch: selectedBranch, // Ensure we handle undefined if no branch is found
        items: this.serviceItemWithImage.filter(item => item.serviceItem?.venId === vendor.id),
        approveBy: this.serviceOrder?.orderApproveBy || 'Signature Required'
      };
    }).filter(Boolean); // Ensure no empty objects are passed to the next stage

    if (serviceOrderDetails.length > 0) {
      await this.generateServiceReport(serviceOrderDetails, this.serviceOrder?.serviceOrderNo);
    } else {
      console.error('No Service order details available for report generation.');
    }
  }
  private async generateServiceReport(serviceOrderDetails: any[], serviceOrderNo?: string): Promise<void> {
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

          grandTotalAmt += (item.serviceItem.itemRate ?? 0) * (item.serviceItem.itemQty ?? 0);

          table += `
          <tr>
            <td>${index + 1}</td>
            <td>${item.serviceItem.proName}</td>
            <td>${item.serviceItem.itemRate}</td>
            <td>${item.serviceItem.itemQty}</td>
            <td>${((item.serviceItem.itemRate ?? 0) * (item.serviceItem.itemQty ?? 0)).toFixed(1)}</td>
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
  //#endregion


  private async loadBranches(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.branchService.getBranches().subscribe({
        next: (response: ApiResult<BranchMaster>) => {
          if (response.result) {
            this.filteredBranches = response.dataList ?? [];
            resolve(); // Resolve once data is successfully loaded
          } else {
            reject('Failed to load branches.');
          }
        },
        error: (err) => {
          console.error('Error fetching Branch Details', err);
          reject(err);
        }
      });
    });
  }
  private formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
