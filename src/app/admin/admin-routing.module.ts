import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryMngComponent } from './pages/master/category-mng/category-mng.component';
import { VendorMngComponent } from './pages/master/vendor-mng/vendor-mng.component';
import { CurrencyMngComponent } from './pages/master/currency-mng/currency-mng.component';
import { UserMngComponent } from './pages/master/user-mng/user-mng.component';
import { DepartmentMngComponent } from './pages/master/department-mng/department-mng.component';
import { BranchMngComponent } from './pages/master/branch-mng/branch-mng.component';
import { NewPurchaseFormComponent } from './pages/Purchase/new-purchase-form/new-purchase-form.component';
import { ProductMngComponent } from './pages/master/product-mng/product-mng.component';
import { GetApprovalPendingOrderAtAdminComponent } from './pages/PurchaseTable/get-approval-pending-order-at-admin/get-approval-pending-order-at-admin.component';
import { GetApprovedOrderAtAdminComponent } from './pages/PurchaseTable/get-approved-order-at-admin/get-approved-order-at-admin.component';
import { GetRejectedOrderAtAdminComponent } from './pages/PurchaseTable/get-rejected-order-at-admin/get-rejected-order-at-admin.component';
import { GetWaitingOrderAtAdminComponent } from './pages/PurchaseTable/get-waiting-order-at-admin/get-waiting-order-at-admin.component';
import { ViewReceivedItemsFormComponent } from './pages/Purchase/view-received-items-form/view-received-items-form.component';
import { NewStockTableComponent } from './pages/stock/new-stock-table/new-stock-table.component';
import { NewStockFormComponent } from './pages/stock/new-stock-form/new-stock-form.component';
import { AssignItemComponent } from './pages/stock/assign-item/assign-item.component';
import { DisposeItemComponent } from './pages/stock/dispose-item/dispose-item.component';
import { AvailableItemComponent } from './pages/stock/available-item/available-item.component';
import { NewServiceFormComponent } from './pages/Service/new-service-form/new-service-form.component';
import { GetServiceApprovalPendingOrderAtAdminComponent } from './pages/ServiceTable/get-service-approval-pending-order-at-admin/get-service-approval-pending-order-at-admin.component';
import { GetServiceApprovedOrderAtAdminComponent } from './pages/ServiceTable/get-service-approved-order-at-admin/get-service-approved-order-at-admin.component';
import { GetServiceRejectedOrderAtAdminComponent } from './pages/ServiceTable/get-service-rejected-order-at-admin/get-service-rejected-order-at-admin.component';
import { GetServiceWaitingOrderAtAdminComponent } from './pages/ServiceTable/get-service-waiting-order-at-admin/get-service-waiting-order-at-admin.component';
import { GetCompletedOrderAtAdminComponent } from './pages/PurchaseTable/get-completed-order-at-admin/get-completed-order-at-admin.component';
import { DashboardAdminComponent } from './pages/Dashboard/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  { 
    path : '',  //Default Component to load from admin section
    component : DashboardAdminComponent
  },
  {
    path:"category",
    component:CategoryMngComponent
  },
  {
    path:"vendor",
    component:VendorMngComponent
  },
  {
    path:"currency",
    component:CurrencyMngComponent
  },
  {
    path:"user",
    component:UserMngComponent
  },
  {
    path:"branch",
    component:BranchMngComponent
  },
  {
    path:"department",
    component:DepartmentMngComponent
  },
  {
    path:"newPurchase",
    component:NewPurchaseFormComponent
  },
  {
    path:"product",
    component:ProductMngComponent
  },
  {
    path:"approval-pending",
    component:GetApprovalPendingOrderAtAdminComponent
  },
  {
    path:"approved",
    component:GetApprovedOrderAtAdminComponent
  },
  {
    path:"rejected",
    component:GetRejectedOrderAtAdminComponent
  },
  {
    path:"waiting",
    component:GetWaitingOrderAtAdminComponent
  },
  {
    path:"completed",
    component:GetCompletedOrderAtAdminComponent
  },
  {
    path:"view-Received-Items-Form/:purchaseOrderNo",
    component:ViewReceivedItemsFormComponent
  },
  {
    path:"newStocks",
    component:NewStockTableComponent
  },
  {
    path:"new-stock-view-form/:purchaseOrderNo",
    component:NewStockFormComponent
  },
  {
    path:"assign",
    component:AssignItemComponent
  },
  {
    path:"dispose",
    component:DisposeItemComponent
  },
  {
    path:"available",
    component:AvailableItemComponent
  },
  {
    path:"service",
    component:NewServiceFormComponent
  },
  {
    path:"service-approval",
    component:GetServiceApprovalPendingOrderAtAdminComponent
  },
  {
    path:"service-approved",
    component:GetServiceApprovedOrderAtAdminComponent
  },
  {
    path:"service-rejected",
    component:GetServiceRejectedOrderAtAdminComponent
  },
  {
    path:"service-waiting",
    component:GetServiceWaitingOrderAtAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
