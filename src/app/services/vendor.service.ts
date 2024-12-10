import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VendorUpdateData {
  name?: string;
  email?: string;
  ticketsPerRelease?: number;
  ticketReleaseInterval?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://localhost:8080/api/vendors';

  constructor(private http: HttpClient) {}

  // Get all vendors
  getVendorDetails(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${email}`);
  }

  // Get all vendors
  updateVendorProfile(email: string, updatedData: VendorUpdateData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${email}`,updatedData);
  }

  // Get all vendors
  startTicketRelease(vendorName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vendorName}/reactivate`, {});
  }
  // Get all vendors
  stopTicketRelease(vendorName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${vendorName}/deactivate`, {});
  }
}