import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerUpdateData {
  name?: string;
  email?: string;
  ticketsToPurchase?: number;
  ticketRetrievalInterval?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  getCustomerDetails(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/details/${email}`);
  }

  updateCustomerProfile(email: string, updateData: CustomerUpdateData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${email}`, updateData);
  }
}