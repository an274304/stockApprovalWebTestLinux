export class PurchaseItem {
    id?: number;
    purchaseOrderId?: number;
    purchaseOrderNo?: string;
    catId?: number;
    catName?: string;
    proId?: number;
    proName?: string;
    venId?: number;
    venName?: string;
    itemName?: string;
    itemRemark?: string;
    itemRate?: number;
    itemQty?: number;
    isApproveItemStatusByDirector?: boolean;
    status?: boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<PurchaseItem>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }
  