import { Routes } from '@angular/router';
import { CustomerSignInComponent } from './components/sign-in/customer-sign-in/customer-sign-in.component';
import { VendorSignInComponent } from './components/sign-in/vendor-sign-in/vendor-sign-in.component';
import { VendorSignUpComponent } from './components/sign-up/vendor-sign-up/vendor-sign-up.component';
import { CustomerSignUpComponent } from './components/sign-up/customer-sign-up/customer-sign-up.component';
import { VendorDashboardComponent } from './components/dashboard/vendor-dashboard/vendor-dashboard.component';

export const routes: Routes = [
  { path: 'customer-sign-in', component: CustomerSignInComponent },
  { path: 'vendor-sign-in', component: VendorSignInComponent },
  { path: 'vendor-sign-up', component: VendorSignUpComponent },
  {path: 'customer-sign-up', component: CustomerSignUpComponent},
  {path: 'vendor-dashboard', component: VendorDashboardComponent},
  { path: '', redirectTo: '/vendor-sign-up', pathMatch: 'full' },
];
