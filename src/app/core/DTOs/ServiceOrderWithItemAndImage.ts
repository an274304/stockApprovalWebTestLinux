import { ServiceOrder } from "../Models/ServiceOrder";
import { ServiceItemWithImage } from "./ServiceItemWithImage";

export class ServiceOrderWithItemAndImage {
    serviceOrder?: ServiceOrder;
    serviceItemWithImages?: ServiceItemWithImage[];
  
    constructor(init?: Partial<ServiceOrderWithItemAndImage>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }