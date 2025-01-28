export class ProductMaster {
    id?: number;  
    catId?: number;
    proName?: string;
    proCode?: string;
    proPrefix?: string;
    proType?: string;
    proImg?: string;
    proBuyDt?: Date;
    proExpDt?: Date;
    status?: Boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
    isAsset?: Boolean;
    proDesc?: string;
  
    constructor(init?: Partial<ProductMaster>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }