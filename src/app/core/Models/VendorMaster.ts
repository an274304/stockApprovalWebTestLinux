export class VendorMaster {
    id?: number;
    venName?: string;
    venCode?: string;
    venShopName?: string;
    venImg?: string;
    venAddress?: string;
    venEmail?: string;
    venMob?: string;
    venGstin?: string;
    status?: boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<VendorMaster>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }
  