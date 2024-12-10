import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventConfigurationUpdateData } from '../components/event-config-edit-modal/event-config-edit-modal.component';

export interface EventConfiguration {
  eventName: string;
  maxCapacity: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
}

export interface TicketPoolStatus {
  configured: boolean;
  availableTickets: number;
  eventName: string;
  maxCapacity: number;
  ticketReleaseRate: number;
  customerRetrievalRate: number;
}

export interface Ticket {
  id: string;
  customer: {
    name: string;
    participantId: string;
  };
  vendor: {
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TicketpoolService {
  private apiUrl = 'http://localhost:8080/api/ticket-pool';

  constructor(private http: HttpClient) {}

   // Get current event configuration
   getEventConfiguration(): Observable<EventConfigurationUpdateData> {
    return this.http.get<EventConfigurationUpdateData>(`${this.apiUrl}/configuration`);
  }

  // Update event configuration
  updateEventConfiguration(configData: EventConfigurationUpdateData): Observable<EventConfigurationUpdateData> {
    return this.http.put<EventConfigurationUpdateData>(`${this.apiUrl}/configuration`, configData);
  }

  // Get current ticket pool status
  getTicketPoolStatus(): Observable<TicketPoolStatus> {
    return this.http.get<TicketPoolStatus>(`${this.apiUrl}/status`);
  }

  // Get all tickets
  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  // Get tickets by customer
  getTicketsByCustomer(customerName: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${this.apiUrl}/${customerName}/tickets`
    );
  }

  // Get tickets by vendor
  getTicketsByVendor(vendorName: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/${vendorName}/tickets`);
  }

  // Delete ticket
  deleteTicket(customerName: string, ticketId: string): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/tickets/${customerName}/deleteTicket`,
      {
        params: { ticketId },
      }
    );
  }

  // Utility methods for data transformation
  calculateVendorTicketDistribution(tickets: Ticket[]): {
    [key: string]: number;
  } {
    return tickets.reduce((acc, ticket) => {
      const vendorName = ticket.vendor.name;
      acc[vendorName] = (acc[vendorName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  calculateCustomerTicketDistribution(tickets: Ticket[]): {
    [key: string]: number;
  } {
    return tickets.reduce((acc, ticket) => {
      const customerName = ticket.customer.name;
      acc[customerName] = (acc[customerName] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }
}
