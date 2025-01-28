import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewApprovedBillComponent } from './pages/vendorBill/view-approved-bill/view-approved-bill.component';
import { PendingBillComponent } from './pages/vendorBillTable/pending-bill/pending-bill.component';
import { ViewPendingBillComponent } from './pages/vendorBill/view-pending-bill/view-pending-bill.component';
import { ApprovedBillComponent } from './pages/vendorBillTable/approved-bill/approved-bill.component';
import { RejectedBillComponent } from './pages/vendorBillTable/rejected-bill/rejected-bill.component';
import { ViewRejectedBillComponent } from './pages/vendorBill/view-rejected-bill/view-rejected-bill.component';
import { AvailableItemDirectorComponent } from './pages/stockTable/available-item-director/available-item-director.component';
import { PendingServiceComponent } from './pages/serviceTable/pending-service/pending-service.component';
import { RejectedServiceComponent } from './pages/serviceTable/rejected-service/rejected-service.component';
import { ApprovedServiceComponent } from './pages/serviceTable/approved-service/approved-service.component';
import { ViewServicePendingComponent } from './pages/service/view-service-pending/view-service-pending.component';
import { DashboardDirectorComponent } from './pages/dashboard/dashboard-director/dashboard-director.component';
import { ProfileDirectorComponent } from './pages/dashboard/profile-director/profile-director.component';

const routes: Routes = [
  {
    path:'', //Default Component to load from director section
    component: DashboardDirectorComponent
  },
  {
    path:'profile', 
    component: ProfileDirectorComponent
  },
  {
    path:'bill-pending',
    component: PendingBillComponent
  },
  {
    path:'pending/:purchaseOrderNo',
    component: ViewPendingBillComponent
  },
  {
    path:'bill-approved',
    component: ApprovedBillComponent
  },
  {
    path:'approved/:purchaseOrderNo',
    component: ViewApprovedBillComponent
  },
  {
    path:'bill-rejected',
    component: RejectedBillComponent
  },
  {
    path:'rejected/:purchaseOrderNo',
    component: ViewRejectedBillComponent
  },
  {
    path:'available',
    component: AvailableItemDirectorComponent
  },
  {
    path:'service-pending',
    component: PendingServiceComponent
  },
  {
    path:'view-service-pending/:serviceOrderNo',
    component: ViewServicePendingComponent
  },
  {
    path:'service-approved',
    component: ApprovedServiceComponent
  },
  {
    path:'service-rejected',
    component: RejectedServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectorRoutingModule { }
