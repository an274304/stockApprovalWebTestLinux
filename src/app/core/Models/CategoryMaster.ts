export class CategoryMaster {
  id?: number;  
  catVendorId?: number;
  catName?: string;
  catCode?: string;
  catPrefix?: string;
  catType?: string;
  catImg?: string;
  status?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;

  constructor(init?: Partial<CategoryMaster>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
