export class ServiceItemPicture {
    id?: number;
    serviceItemId?: number; // Assuming this is a number referring to ServiceItem
    picName?: string;
    picPath?: string;
    picData?: Uint8Array; // Using Uint8Array for binary data
    status?: boolean;
    createdDt?: Date;
    createdBy?: string;
    updatedDt?: Date;
    updatedBy?: string;
  
    constructor(init?: Partial<ServiceItemPicture>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }