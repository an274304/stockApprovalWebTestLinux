import { Routes } from '@angular/router';
import { LogInComponent } from './shared/components/log-in/log-in.component';
import { AppComponent } from './app.component';
import { AuthGaurd } from './core/Guards/auth.guard';
import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';
import { DirectorLayoutComponent } from './director/components/director-layout/director-layout.component';
import { AccountLayoutComponent } from './accounts/components/account-layout/account-layout.component';

export const routes: Routes = [

  { 
    path: 'admin', 
    component : AdminLayoutComponent,
    canActivate: [AuthGaurd],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) 
  },
  { 
    path: 'director', 
    component : DirectorLayoutComponent,
    canActivate: [AuthGaurd],
    loadChildren: () => import('./director/director.module').then(m => m.DirectorModule) 
  },
  { 
    path: 'account', 
    component : AccountLayoutComponent,
    canActivate: [AuthGaurd],
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) 
  },
  { path: 'login', component: LogInComponent }, 
  //{ path: 'app', component: AppComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Added pathMatch to avoid unwanted redirects
  { path: '**', redirectTo: 'login' }

];
