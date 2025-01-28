export class UserTypeMaster {
    id?: number;
    usTypeName?: string;
    usTypeCode?: string;
    usTypePrefix?: string;
    usTypeImg?: string;
    status?: boolean;
    created?: Date;
    createdBy?: string;
    updated?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<UserTypeMaster>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }
  