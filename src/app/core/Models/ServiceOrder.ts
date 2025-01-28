export class ServiceOrder {
    id?: number;
    serviceOrderNo?: string;
    serviceRemark?: string;
    serviceCurrency?: string;
    serviceOrderDt?: Date;
    serviceExpDelDt?: Date;
    isFromAdminToDirector?: boolean;
    isFromAdminToVendor?: boolean;
    vendorBillPath?: string;
    isFromAdminToAcct?: boolean;
    acctsBillPayedReceipt?: string;
    isAcctsBillPayed?: boolean;
    status?: boolean;
    createdDt?: Date;
    createdBy?: string;
    updatedDt?: Date;
    updatedBy?: string;
    orderCreatedBy?: string;
    orderCreatedDt?: Date;
    orderApproveBy?: string;
    orderApproveDt?: Date;
    orderRejectedBy?: string;
    orderRejectedDt?: Date;
    orderUnderProgressBy?: string;
    orderUnderProgressDt?: Date;
    orderBillReceiptUploadBy?: string;
    orderBillReceiptUploadDt?: Date;
  
    constructor(init?: Partial<ServiceOrder>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }