export class UpdateNewStockItem {
    purchaseOrderNo?: string;
    purchaseItemId?: number;
    itemExpiryDt?: Date;
  
    constructor(init?: Partial<UpdateNewStockItem>) {
      Object.assign(this, init);
    }
  }