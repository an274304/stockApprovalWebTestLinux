export class ServiceItem {
    id?: number;
    serviceOrderId?: number; // Assuming this is a number referring to ServiceOrder
    serviceOrderNo?: string;
    catId?: number;
    catName?: string;
    proId?: number;
    proName?: string;
    venId?: number;
    venName?: string;
    itemRemark?: string;
    itemRate?: number; // Using number for decimal
    itemQty?: number;
    isApproveItemStatusByDirector?: boolean;
    status?: boolean;
    createdDt?: Date;
    createdBy?: string;
    updatedDt?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<ServiceItem>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }