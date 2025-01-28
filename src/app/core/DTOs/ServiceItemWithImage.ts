import { ServiceItem } from "../Models/ServiceItem";
import { ServiceItemPicture } from "../Models/ServiceItemPicture";
import { ServiceItemPictureType } from "./ServiceItemPictureType";

export class ServiceItemWithImage {
    serviceItem?: ServiceItem;
    serviceItemPictures?: ServiceItemPictureType[];
  
    constructor(init?: Partial<ServiceItemWithImage>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }