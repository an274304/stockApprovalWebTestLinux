export class CurrencyMaster {
  id?: number;
  currName?: string;
  currCode?: string;
  currPrefix?: string;
  currSymbol?: string;
  currInrVal?: number;
  currInrValDate?: Date;
  status?: boolean;
  created?: Date;
  createdBy?: string;
  updated?: Date;
  updatedBy?: string;

  constructor(init?: Partial<CurrencyMaster>) {
    if (init) {
      Object.assign(this, init);
    }
  }
  }
  