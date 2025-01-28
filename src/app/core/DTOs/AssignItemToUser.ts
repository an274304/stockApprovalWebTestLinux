export class AssignItemToUser {
    userId?: number;
    catId?: number;
    proId?: number;
    count?: number;
    remark?: string;
  
    constructor(init?: Partial<AssignItemToUser>) {
        if (init) {
          Object.assign(this, init);
        }
      }
  }
  