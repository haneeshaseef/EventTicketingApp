import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginCredentials {
  email: string;
  password: string;
}

interface VendorRegistration {
  name: string;
  email: string;
  ticketsPerRelease: number;
  ticketReleaseInterval: number;
  ticketsToSell: number;
  password: string;
}

interface CustomerRegistration {
  name: string;
  email: string;
  password: string;
  ticketsToPurchase: number;
  ticketRetrievalInterval: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Login methods for customer and vendor
  customerLogin(credentials: LoginCredentials): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/customer/login`, null, {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          // Save customer login credentials and login status
          localStorage.setItem('customerEmail', credentials.email);
          localStorage.setItem('customerLoginTimestamp', Date.now().toString());
          localStorage.setItem('isCustomerLoggedIn', 'true');
        }),
        catchError((error) => {
          console.error('Customer Login Error', error);
          return of('Login Failed');
        })
      );
  }

  // Login methods for customer and vendor
  vendorLogin(credentials: LoginCredentials): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/vendor/login`, null, {
        params: {
          email: credentials.email,
          password: credentials.password,
        },
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          // Save vendor login credentials and login status in the local storage
          localStorage.setItem('vendorEmail', credentials.email);
          localStorage.setItem('vendorLoginTimestamp', Date.now().toString());
          localStorage.setItem('isVendorLoggedIn', 'true');
        }),
        catchError((error) => {
          console.error('Vendor Login Error', error);
          return of('Login Failed');
        })
      );
  }

  // Register methods for customer and vendor
  customerRegister(customerData: CustomerRegistration): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/customer/register`, customerData, {
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          //Register the customer email in the local storage
          localStorage.setItem('registeredCustomerEmail', customerData.email);
        })
      );
  }

  // Register methods for customer and vendor
  vendorRegister(vendorData: VendorRegistration): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/vendor/register`, vendorData, {
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          //Register the vendor email in the local storage
          localStorage.setItem('registeredVendorEmail', vendorData.email);
        })
      );
  }

  // Logout methods for customer and vendor
  customerLogout(email: string): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/customer/logout`, null, {
        params: { email },
        responseType: 'text',
      })
      .pipe(
        tap(() => this.clearCustomerSession()),
        catchError((error) => {
          this.clearCustomerSession();
          return of('Logout Successful');
        })
      );
  }

  // Logout methods for customer and vendor
  vendorLogout(email: string): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/vendor/logout`, null, {
        params: { email },
        responseType: 'text',
      })
      .pipe(
        tap(() => this.clearVendorSession()),
        catchError((error) => {
          this.clearVendorSession();
          return of('Logout Successful');
        })
      );
  }

  // Helper methods to manage session state
  clearCustomerSession() {
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerLoginTimestamp');
    localStorage.removeItem('isCustomerLoggedIn');
  }

  clearVendorSession() {
    localStorage.removeItem('vendorEmail');
    localStorage.removeItem('vendorLoginTimestamp');
    localStorage.removeItem('isVendorLoggedIn');
  }

  // Check if customer is logged in
  isCustomerLoggedIn(): boolean {
    return localStorage.getItem('isCustomerLoggedIn') === 'true';
  }

  // Check if vendor is logged in
  isVendorLoggedIn(): boolean {
    return localStorage.getItem('isVendorLoggedIn') === 'true';
  }

  // Get current logged-in user's email
  getCurrentCustomerEmail(): string | null {
    return localStorage.getItem('customerEmail');
  }

  // Get current logged-in vendor's email
  getCurrentVendorEmail(): string | null {
    return localStorage.getItem('vendorEmail');
  }

  // Admin Login
  adminLogin(username: string, password: string): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http
      .post(`${this.apiUrl}/admin/login`, null, {
        params: params,
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          // Save admin login credentials and login status in the local storage
          localStorage.setItem('adminUsername', username);
          localStorage.setItem('adminLoginTimestamp', Date.now().toString());
          localStorage.setItem('isAdminLoggedIn', 'true');
        }),
        catchError((error) => {
          console.error('Admin Login Error', error);
          return of('Login Failed');
        })
      );
  }

  // Admin Logout
  adminLogout(username: string): Observable<string> {
    return this.http
      .post(`${this.apiUrl}/admin/logout`, null, {
        params: { username },
        responseType: 'text',
      })
      .pipe(
        tap(() => this.clearAdminSession()),
        catchError((error) => {
          this.clearAdminSession();
          return of('Logout Successful');
        })
      );
  }

  // Clear Admin Session
  clearAdminSession() {
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminLoginTimestamp');
    localStorage.removeItem('isAdminLoggedIn');
  }
}
