export class ShowAvailableStockTable {
    categoryName?: string;
    productName?: string;
    productId?: number;
    total?: number;
    totalAvailable?: number;
    totalAssigned?: number;
    totalDispose?: number;

    constructor(init?: Partial<ShowAvailableStockTable>) {
        Object.assign(this, init);
    }
}
