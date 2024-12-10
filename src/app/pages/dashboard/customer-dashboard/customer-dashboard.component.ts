import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CustomerService, CustomerUpdateData } from '../../../services/customer.service';
import { CustomerProfileModalComponent } from '../../../components/customer-profile-modal/customer-profile-modal.component';
import { EventConfigCardComponent } from '../../../components/event-config-card/event-config-card.component';
import { TicketpoolService } from '../../../services/ticketpool.service';

interface CustomerDashboardData {
  eventConfiguration: {
    eventName: string;
    maxCapacity: number;
    ticketReleaseRate: number;
    customerRetrievalRate: number;
    configured: boolean;
  };
  customerDetails: {
    name: string;
    email: string;
    totalTicketsPurchased: number;
    isActive: boolean;
    ticketsToPurchase: number;
    ticketRetrievalInterval: number;
  };
  purchaseStatistics: {
    totalSpent: number;
    averageTicketsPerPurchase: number;
    lastMonthPurchases: number;
  };
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    CustomerProfileModalComponent,
    EventConfigCardComponent
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit {
  customerDashboardData!: CustomerDashboardData;
  showProfileModal = false;
  errorMessage: string = '';
  
  constructor(
    private customerService: CustomerService,
    private ticketPoolService: TicketpoolService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomerDashboardData();
  }

  // Load customer dashboard data
  loadCustomerDashboardData() {
    const customerEmail = this.authService.getCurrentCustomerEmail();

    if (!customerEmail) {
      this.router.navigate(['/customer-sign-in']);
      return;
    }
    this.ticketPoolService.getTicketPoolStatus().subscribe({
      next: (eventStatus) => {
        this.customerService.getCustomerDetails(customerEmail).subscribe({
          next: (response) => {
            this.customerDashboardData = {
              eventConfiguration: {
                eventName: eventStatus.eventName,
                maxCapacity: eventStatus.maxCapacity,
                ticketReleaseRate: eventStatus.ticketReleaseRate,
                customerRetrievalRate: eventStatus.customerRetrievalRate,
                configured: eventStatus.configured
              },
              customerDetails: {
                name: response.customer.name,
                email: response.customer.email,
                totalTicketsPurchased: response.customer.totalTicketsPurchased,
                isActive: response.customer.isActive,
                ticketsToPurchase: response.customer.ticketsToPurchase,
                ticketRetrievalInterval: response.customer.ticketRetrievalInterval
              },
              purchaseStatistics: {
                totalSpent: this.calculateTotalSpent(response.customer.totalTicketsPurchased),
                averageTicketsPerPurchase: this.calculateAverageTicketsPerPurchase(),
                lastMonthPurchases: this.calculateLastMonthPurchases()
              }
            };
          },
          error: (error) => {
            console.error('Failed to load customer details', error);
            this.errorMessage = 'Failed to load customer details';
            this.router.navigate(['/customer-sign-in']);
          }
        });
      },
      error: (error) => {
        console.error('Failed to load event configuration', error);
        this.errorMessage = 'Failed to load event configuration';
        this.router.navigate(['/customer-sign-in']);
      }
    });
  }

  openEditProfile() {
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  updateProfile(updatedData: CustomerUpdateData) {
    const customerEmail = this.authService.getCurrentCustomerEmail();
    
    if (!customerEmail) return;

    this.customerService.updateCustomerProfile(customerEmail, updatedData).subscribe({
      next: (response) => {
        // Update local data with response
        this.customerDashboardData.customerDetails = {
          ...this.customerDashboardData.customerDetails,
          ...updatedData
        };
        this.closeProfileModal();
      },
      error: (error) => {
        console.error('Failed to update profile', error);
        // Optional: Show error toast or message
      }
    });
  }

  logout() {
    const customerEmail = localStorage.getItem('customerEmail');
    
    if (customerEmail) {
      this.authService.customerLogout(customerEmail).subscribe({
        next: () => {
          localStorage.removeItem('customerEmail');
          localStorage.removeItem('customerToken');
          this.router.navigate(['/customer-sign-in']);
        },
        error: (error) => {
          console.error('Logout failed', error);
          // Force logout even if server call fails
          localStorage.removeItem('customerEmail');
          localStorage.removeItem('customerToken');
          this.router.navigate(['/customer-sign-in']);
        }
      });
    }
  }

  // Customer operation method
  startCustomerOperation() {
    const customerName = this.customerDashboardData.customerDetails.name;

    this.customerService.startTicketRetrieval(customerName).subscribe({
      next: (response) => {
       this.customerDashboardData.customerDetails.isActive = true;
       console.log('Customer operation started successfully');
      },
      error: (error) => {
        console.error('Failed to start customer operation', error);
      }
    });
  }

  // Customer operation method
  stopCustomerOperation() {
    const customerName = this.customerDashboardData.customerDetails.name;

    this.customerService.stopTicketRetrieval(customerName).subscribe({
      next: (response) => {
        this.customerDashboardData.customerDetails.isActive = false;
        console.log('Customer operation stopped successfully');
      },
      error: (error) => {
        console.error('Failed to stop customer operation', error);
      }
    });
  }

  // Helper methods for calculating purchase statistics
  private calculateTotalSpent(totalTicketsPurchased: number): number {
    const averageTicketPrice = 500;
    return totalTicketsPurchased * averageTicketPrice;
  }

  private calculateAverageTicketsPerPurchase(): number {
    return 2;
  }

  private calculateLastMonthPurchases(): number {
    return this.calculateTotalSpent(40) * 0.75;
  }
}