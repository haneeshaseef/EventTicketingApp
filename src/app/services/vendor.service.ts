import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://localhost:8080/api/vendors';

  constructor(private http: HttpClient) {}

  getVendorDetails(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${email}`);
  }

  updateVendorProfile(email: string, vendorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${email}`, vendorData);
  }
}