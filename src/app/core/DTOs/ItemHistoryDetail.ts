export class ItemHistoryDetail {
    orderNo?: string;
    categoryName?: string;
    productName?: string;
    vendorName?: string;
    itemRate?: number; 
    itemQty?: number;  
    requestedBy?: string;
    requestedDate?: Date; 
    approveBy?: string;
    approveDate?: Date;

    constructor(init?: Partial<ItemHistoryDetail>) {
        if (init) {
          Object.assign(this, init);
        }
      }
}
