
export const ApiUrl = {
                            baseApiUrl: 'https://stockApi.committedcargo.net/api/',
                      //         baseApiUrl: 'https://localhost:7071/api/',

    auth : {
        AUTH : 'v1/Auth/LogIn',
        GET_ALL_USER_TYPE : 'v1/Auth/GetAllUserType'
    },

    category : {
        GET_ALL_CATEGORY : 'v1/Category/all',
        SAVE_CATEGORY : 'v1/Category/save',
        UPDATE_CATEGORY : 'v1/Category/update',
        GET_CATEGORY_BY_ID : 'v1/Category/get/',
        DELETE_CATEGORY_BY_ID : 'v1/Category/delete/'
    },

    branch : {
        GET_ALL_BRANCH : 'v1/Branch/all',
        SAVE_BRANCH : 'v1/Branch/save',
        UPDATE_BRANCH : 'v1/Branch/update',
        GET_BRANCH_BY_ID : 'v1/Branch/get/',
        DELETE_BRANCH_BY_ID : 'v1/Branch/delete/'
    },

    vendor : {
        GET_ALL_VENDOR : 'v1/Vendor/all',
        GET_ALL_VENDOR_BY_CAT_ID : 'v1/Vendor/GetAllVendorByCatId/',
        SAVE_VENDOR : 'v1/Vendor/save',
        UPDATE_VENDOR : 'v1/Vendor/update',
        GET_VENDOR_BY_ID : 'v1/Vendor/get/',
        DELETE_VENDOR_BY_ID : 'v1/Vendor/delete/'
    },

    currency : {
        GET_ALL_CURRENCY : 'v1/Currency/all',
        SAVE_CURRENCY : 'v1/Currency/save',
        UPDATE_CURRENCY : 'v1/Currency/update',
        GET_CURRENCY_BY_ID : 'v1/Currency/get/',
        DELETE_CURRENCY_BY_ID : 'v1/Currency/delete/'
    },

    user : {
        GET_ALL_USER : 'v1/User/all',
        SAVE_USER : 'v1/User/save',
        UPDATE_USER : 'v1/User/update',
        UPDATE_USERS_PASSWORD : 'v1/User/updateUsersPassword',
        GET_USER_BY_ID : 'v1/User/get/',
        DELETE_USER_BY_ID : 'v1/User/delete/'
    },

    department : {
        GET_ALL_DEPARTMENT : 'v1/Department/all',
        SAVE_DEPARTMENT : 'v1/Department/save',
        UPDATE_DEPARTMENT : 'v1/Department/update',
        GET_DEPARTMENT_BY_ID : 'v1/Department/get/',
        DELETE_DEPARTMENT_BY_ID : 'v1/Department/delete/'
    },

    product : {
        GET_ALL_PRODUCT : 'v1/Product/all',
        GET_ALL_PRODUCT_BY_CAT_ID : 'v1/Product/GetAllProductByCatID/',
        GET_LAST_RATE_OF_PRODUCT_USING_PRO_ID : 'v1/Product/getLastRateOfProductUsingProId/',
        SAVE_PRODUCT : 'v1/Product/save',
        UPDATE_PRODUCT : 'v1/Product/update',
        GET_PRODUCT_BY_ID : 'v1/Product/get/',
        DELETE_PRODUCT_BY_ID : 'v1/Product/delete/'
    },

    purchase : {
        PURCHASE_ORDER : 'v1/Purchase/PurchaseOrder',
        Items_Approve_By_Director : 'v1/Purchase/ItemsApproveByDirector?purchaseOrderNo=',
       // Items_Reject_By_Director : 'v1/Purchase/ItemsRejectByDirector?purchaseOrderNo=',
       Items_Reject_By_Director : 'v1/Purchase/ItemsRejectByDirector',
        Remove_Item_By_Director : 'v1/Purchase/RemoveItemByDirector?purchaseItemId=',
        ITEMS_SEND_TO_VENDOR : 'v1/Purchase/ItemsSendToVendor?purchaseOrderNo=',
        Get_Received_Items_For_Update : 'v1/Purchase/GetReceivedItemsForUpdate?purchaseOrderNo=',
        Received_Items_Update : 'v1/Purchase/ReceivedItemsUpdate',
        Bill_Send_TO_Accts_And_Stock : 'v1/Purchase/BillSendTOAcctsAndStockWithBillAndReceipt',
        Bill_Send_TO_Accts_With_Bill_And_Receipt : 'v1/Purchase/BillSendTOAcctsWithBillAndReceipt',
        ITEMS_SEND_TO_STOCK : 'v1/Purchase/ItemsSendToStock?purchaseOrderNo=',
        Upload_Payed_Receipt_For_Bill : 'v1/Purchase/UploadPayedReceiptForBill',

        //#region Additional Call
        Get_Vendor_Dtls_By_PurchaseOrderNo : 'v1/Purchase/GetVendorDtlsByPurchaseOrderNo?purchaseOrderNo=',
        //#endregion
    },

    purchaseTable : {
        Get_Approval_Pending_Order_At_Admin : 'v1/PurchaseTable/GetApprovalPendingOrderAtAdmin',
        Get_Approved_Order_At_Admin : 'v1/PurchaseTable/GetApprovedOrderAtAdmin',
        Get_Rejected_Order_At_Admin : 'v1/PurchaseTable/GetRejectedOrderAtAdmin',
        Get_Waiting_Order_At_Admin : 'v1/PurchaseTable/GetWaitingOrderAtAdmin',
        Get_Order_To_Approve_At_Director : 'v1/PurchaseTable/GetOrderToApproveAtDirector',
    },

    service : {
        SERVICE_ORDER : 'v1/Service/ServiceOrder',
        SERVICE_ITEMS_SEND_TO_VENDOR : 'v1/Service/ServiceItemsSendToVendor?serviceOrderNo=',
        SERVICE_ITEMS_SEND_TO_COMPLETED : 'v1/Service/ServiceItemsSendToCompleted?serviceOrderNo=',
        Get_Service__Vendor_Dtls_By_ServiceOrderNo : 'v1/Service/GetServiceVendorDtlsByServiceOrderNo?serviceOrderNo='
    },

    serviceTable : {
        Get_Service_Approval_Pending_Order_At_Admin : 'v1/ServiceTable/GetServiceApprovalPendingOrderAtAdmin',
        Get_Service_Approved_Order_At_Admin : 'v1/ServiceTable/GetServiceApprovedOrderAtAdmin',
        Get_Service_Rejected_Order_At_Admin : 'v1/ServiceTable/GetServiceRejectedOrderAtAdmin',
        Get_Service_Waiting_Order_At_Admin : 'v1/ServiceTable/GetServiceWaitingOrderAtAdmin',
        Get_Service_Order_To_Approve_At_Director : 'v1/ServiceTable/GetServiceOrderToApproveAtDirector'
    },

    stock : {
       //#region Stock Table
        Get_Available_Stock_At_Admin : 'v1/Stock/GetAvailableStockAtAdmin',
        Get_Users_Via_Alloted_Product_Id : 'v1/Stock/getUsersViaAllotedProductId?productId=',
       //#endregion

        //#region Stock In
        Get_New_Stock_At_Admin : 'v1/Stock/GetNewStockAtAdmin',
        Get_New_Stock_Items_At_Admin : 'v1/Stock/GetNewStockItemsAtAdmin?purchaseOrderNo=',
        Load_Updated_Stock_Master_Items : 'v1/Stock/loadUpdatedStockMasterItems?purchaseOrderNo=',
        Update_New_Stock_Item : 'v1/Stock/UpdateNewStockItem',
        //#endregion

        //#region Item_Assign
        Get_Available_Category_For_Assign_Item : 'v1/Stock/GetAvailableCategoryForAssignItem',
        Get_Available_Product_For_Assign_Item : 'v1/Stock/GetAvailableProductForAssignItem?catId=',
        Get_Available_Item_For_Assign_Item : 'v1/Stock/GetAvailableItemForAssignItem?proId=',
        Assign_Items_To_User_At_Admin : 'v1/Stock/AssignItemsToUserAtAdmin',
        //#endregion

        //#region Item_Dispose
        Get_Assigned_Stock_Items_By_UserId : 'v1/Stock/GetAssignedStockItemsByUserId?userId=',
        Get_Disposed_Stock_Items_By_UserId : 'v1/Stock/GetDisposedStockItemsByUserId?userId=',
        Dispose_Stock_Item_By_Id : 'v1/Stock/DisposeStockItemById?StockItemId=',
        Dispose_Bulk_From_Stock_Master_By_Id_Array : 'v1/Stock/DisposeBulkFromStockMasterByIdArray'
        //#endregion
    },

    vendorBill_Director : {
        Get_Pending_Items_For_Approval_At_Director : 'v1/VendorBill/GetPendingItemsForApprovalAtDirector?purchaseOrderNo=',
        Get_Item_History_Detail_By_Purchase_Item_Id : 'v1/VendorBill/GetItemHistoryDetailByPurchaseItemId?purchaseItemId='
    },

    vendorBillTable_Director : {

        //#region Approved table
        Get_Approved_Bill_At_Director : 'v1/VendorBillTable/GetApprovedBillAtDirector',
        Get_Approved_Item_By_OrderNo_At_Director : 'v1/VendorBillTable/GetApprovedItemByOrderNoAtDirector?purchaseOrderNo=',
        //#endregion

        //#region Pending Table
        Get_Pending_Bill_At_Director : 'v1/VendorBillTable/GetPendingBillAtDirector',
        Get_Approved_Pending_Item_By_OrderNo_At_Director : 'v1/VendorBillTable/GetApprovedPendingItemByOrderNoAtDirector?purchaseOrderNo=',
        //#endregion
       
        //#region Rejected Table
         Get_Rejected_Bill_At_Director : 'v1/VendorBillTable/GetRejectedBillAtDirector',
         Get_Rejected_Item_By_OrderNo_At_Director : 'v1/VendorBillTable/GetRejectedItemByOrderNoAtDirector?purchaseOrderNo='
        //#endregion
       
    },

    service_Director : {
        Get_Service_Pending_Items_For_Approval_At_Director : 'v1/serviceDirector/GetServicePendingItemsForApprovalAtDirector?serviceOrderNo=',
        Get_Service_Item_History_By_Service_Item_Id_At_Director : 'v1/serviceDirector/GetServiceItemHistoryByServiceItemIdAtDirector?serviceItemId=',
        Approve_Service_Pending_Items_For_Approval_At_Director : 'v1/serviceDirector/ApproveServicePendingItemsForApprovalAtDirector?serviceOrderNo=',
        Reject_Service_Pending_Items_For_Approval_At_Director : 'v1/serviceDirector/RejectServicePendingItemsForApprovalAtDirector?serviceOrderNo=',
        Remove_Service_Pending_Items_For_Approval_At_Director : 'v1/serviceDirector/RemoveServicePendingItemsForApprovalAtDirector?serviceItemId=',
    },

    serviceTable_Director : {

        Get_All_Service_Item_By_OrderNo_At_Director : 'v1/ServiceDirectorTable/GetAllServiceItemByOrderNoAtDirector?serviceOrderNo=',

        //#region Service Approved table
        Get_Service_Approved_At_Director : 'v1/ServiceDirectorTable/GetServiceApprovedAtDirector',
        Get_Service_Approved_Item_By_OrderNo_At_Director : 'v1/ServiceDirectorTable/GetServiceApprovedItemByOrderNoAtDirector?serviceOrderNo=',
        //#endregion

        //#region Service Pending Table
        Get_Service_Pending_At_Director : 'v1/ServiceDirectorTable/GetServicePendingAtDirector',
        //#endregion
       
        //#region Service Rejected Table
         Get_Service_Rejected_At_Director : 'v1/ServiceDirectorTable/GetServiceRejectedAtDirector',
         Get_Service_Rejected_Item_By_OrderNo_At_Director : 'v1/ServiceDirectorTable/GetServiceRejectedItemByOrderNoAtDirector?serviceOrderNo='
        //#endregion
       
    },

    vendorBill_Account : {
        Get_View_Pending_Bill_At_Account : 'v1/VendorBillAccount/GetViewPendingBillAtAccount?purchaseOrderNo='
    },

    vendorBillTable_Account : {
        Get_Pending_Bill_At_Account : 'v1/VendorBillTableAccount/GetPendingBillAtAccount',
        Get_Payed_Bill_At_Account : 'v1/VendorBillTableAccount/GetPayedBillAtAccount',
        View_Order_Bill_Detail_At_Account : 'v1/VendorBillTableAccount/viewOrderBillDetailAtAccount?purchaseOrderNo='
    },

    serviceBill_Account : {
        View_Service_Order_Bill_Detail_At_Account : 'v1/ServiceBillAccount/viewServiceOrderBillDetailAtAccount?serviceOrderNo=',
        Upload_Payed_Receipt_For_Service_Bill : 'v1/ServiceBillAccount/UploadPayedReceiptForServiceBill'
    },

    serviceBillTable_Account : {
        Get_Service_Pending_Bill_At_Account : 'v1/ServiceBillTableAccount/GetServicePendingBillAtAccount',
        Get_Service_Payed_Bill_At_Account : 'v1/ServiceBillTableAccount/GetServicePayedBillAtAccount'
    },

    dashboard_Director : {
        Get_Count_Dashboard : 'v1/DirectorDash/GetCountDashboard'
    },

    dashboard_Admin : {
        Get_Count_Dashboard : 'v1/AdminDash/GetCountDashboard',
        Get_Expenses_Of_Month_By_Month_And_Year : 'v1/AdminDash/GetExpensesOfMonthByMonthAndYear'
    },

    dashboard_Account : {
        Get_Count_Dashboard : 'v1/AccountDash/GetCountDashboard'
    }
  };