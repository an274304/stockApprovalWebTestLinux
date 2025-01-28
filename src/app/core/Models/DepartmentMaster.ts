export class DepartmentMaster {
    id!: number;
    branchId!: number;
    depName?: string;
    depCode?: string;
    depPrefix?: string;
    depImg?: string;
    status?: boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<DepartmentMaster>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }
  