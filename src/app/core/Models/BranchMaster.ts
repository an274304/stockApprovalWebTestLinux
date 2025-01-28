export class BranchMaster {
    id?: number;
    branchName?: string;
    branchCode?: string;
    branchPrefix?: string;
    branchImg?: string;
    status?: boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
    branchAddress?: string;
  
    constructor(init?: Partial<BranchMaster>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }