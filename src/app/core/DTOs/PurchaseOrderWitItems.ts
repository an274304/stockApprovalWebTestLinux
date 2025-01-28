import { PurchaseItem } from "../Models/PurchaseItem";
import { PurchaseOrder } from "../Models/PurchaseOrder";

export class PurchaseOrderWitItems {
    purchaseOrder?: PurchaseOrder;
    purchaseItems?: PurchaseItem[];
  
    constructor(init?: Partial<PurchaseOrderWitItems>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }