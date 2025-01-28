
export class ServiceItemPictureType {
    proId?: number;
    picName?: string;
    picPath?: string;
    picture?: File; // Updated to include the picture property

    constructor(init?: Partial<ServiceItemPictureType>) {
        if (init) {
          Object.assign(this, init);
        }
      }
}