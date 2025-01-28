export class StockItemMaster {
    id?: number;
    purchaseOrderId?: number;
    purchaseItemId?: number;
    catId?: number;
    proId?: number;
    venId?: number;
    userAssignedId?: number; // Optional
    stockItemCode?: string; // Optional
    stockItemExpDt?: Date; // Optional
    isAssigned?: boolean; // Optional
    assignedDt?: Date; // Optional
    isDispose?: boolean; // Optional
    isDisposeDt?: Date; // Optional
    status?: boolean; // Optional
    created?: Date; // Optional
    createdBy?: string; // Optional
    updated?: Date; // Optional
    updatedBy?: string; // Optional

    constructor(init?: Partial<StockItemMaster>) {
        Object.assign(this, init);
    }
}
