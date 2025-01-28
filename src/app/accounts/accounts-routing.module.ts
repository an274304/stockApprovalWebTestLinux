import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingVendorBillComponent } from './pages/VendorBill/VendorBillTable/pending-vendor-bill/pending-vendor-bill.component';
import { ViewPendingBillComponent } from './pages/VendorBill/view-pending-bill/view-pending-bill.component';
import { PayedVendorBillComponent } from './pages/VendorBill/VendorBillTable/payed-vendor-bill/payed-vendor-bill.component';
import { PendingServiceBillComponent } from './pages/serviceBill/serviceBillTable/pending-service-bill/pending-service-bill.component';
import { ViewServicePendingBillComponent } from './pages/serviceBill/view-service-pending-bill/view-service-pending-bill.component';
import { PayedServiceBillComponent } from './pages/serviceBill/serviceBillTable/payed-service-bill/payed-service-bill.component';
import { DashboardAccountComponent } from './pages/Dashboard/dashboard-account/dashboard-account.component';
import { GetWaitingOrderAtAdminComponent } from '../admin/pages/PurchaseTable/get-waiting-order-at-admin/get-waiting-order-at-admin.component';
import { AvailableItemDirectorComponent } from '../director/pages/stockTable/available-item-director/available-item-director.component';
import { ProfileAccountComponent } from './pages/Dashboard/profile-account/profile-account.component';

const routes: Routes = [
  {
    path:'', //Default Component to load from account section
    component: DashboardAccountComponent
  },
  {
    path:'profile', 
    component: ProfileAccountComponent
  },
  {
    path:'bill-pending',
    component: PendingVendorBillComponent
  },
  {
    path:'pending/:purchaseOrderNo',
    component: ViewPendingBillComponent
  },
  {
    path:"waiting",
    component:GetWaitingOrderAtAdminComponent
  },
  {
    path:'bill-payed',
    component: PayedVendorBillComponent
  },
  {
    path:'service-pending',
    component: PendingServiceBillComponent
  },
  {
    path:'service-pending/:serviceOrderNo',
    component: ViewServicePendingBillComponent
  },
  {
    path:'service-payed',
    component: PayedServiceBillComponent
  },
  {
    path:'available',
    component: AvailableItemDirectorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
