export class UserProductInfoDtoForStockTable {
    userId?: number;
    userName?: string;
    userTypeId?: number;
    userTypeName?: string;
    userEmail?: string;
    userMobile?: string;
    userImage?: string;
    branchId?: number;
    branchName?: string;
    departmentId?: number;
    departmentName?: string;
    categoryId?: number;
    categoryName?: string;
    productId?: number;
    productName?: string;
    vendorId?: number;
    vendorShopName?: string;
    stockItemCode?: string;
    stockItemExpiryDate?: Date;
    assignedDate?: Date;
    remark?: string;

    constructor(data?: Partial<UserProductInfoDtoForStockTable>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
