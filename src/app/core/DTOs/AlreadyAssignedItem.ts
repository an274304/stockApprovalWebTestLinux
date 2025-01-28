export class AlreadyAssignedItem {
    id?: number;              // Optional properties
    vendorName?: string;
    stockItemCode?: string;
    categoryName?: string;
    productName?: string;
    assignDt?: Date;         // Optional properties
    expiryDt?: Date;         // Optional properties
    disposeDt?: Date;        // Optional properties
    remark?: string;
    selected?: boolean;

    constructor(init?: Partial<AlreadyAssignedItem>) {
        if (init) {
            Object.assign(this, init);
            // Convert string dates to Date objects if they exist
            if (init.assignDt) {
                this.assignDt = new Date(init.assignDt);
            }
            if (init.expiryDt) {
                this.expiryDt = new Date(init.expiryDt);
            }
            if (init.disposeDt) {
                this.disposeDt = new Date(init.disposeDt);
            }
        }
    }
}
