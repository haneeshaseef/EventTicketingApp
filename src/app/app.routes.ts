import { Routes } from '@angular/router';

import { CustomerProfileModalComponent } from './components/customer-profile-modal/customer-profile-modal.component';
import { CustomerDashboardComponent } from './pages/dashboard/customer-dashboard/customer-dashboard.component';
import { VendorDashboardComponent } from './pages/dashboard/vendor-dashboard/vendor-dashboard.component';
import { CustomerSignInComponent } from './pages/sign-in/customer-sign-in/customer-sign-in.component';
import { VendorSignInComponent } from './pages/sign-in/vendor-sign-in/vendor-sign-in.component';
import { CustomerSignUpComponent } from './pages/sign-up/customer-sign-up/customer-sign-up.component';
import { VendorSignUpComponent } from './pages/sign-up/vendor-sign-up/vendor-sign-up.component';

export const routes: Routes = [
  { path: 'customer-sign-in', component: CustomerSignInComponent },
  { path: 'vendor-sign-in', component: VendorSignInComponent },
  { path: 'vendor-sign-up', component: VendorSignUpComponent },
  {path: 'customer-sign-up', component: CustomerSignUpComponent},
  {path: 'vendor-dashboard', component: VendorDashboardComponent},
  {path: 'customer-dashboard', component: CustomerDashboardComponent},
  {path: 'customer-profile-modal', component: CustomerProfileModalComponent},
  { path: '', redirectTo: '/vendor-sign-up', pathMatch: 'full' },
];
