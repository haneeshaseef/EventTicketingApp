import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CustomerService, CustomerUpdateData } from '../../../services/customer.service';
import { CustomerProfileModalComponent } from '../../../components/customer-profile-modal/customer-profile-modal.component';

interface CustomerDashboardData {
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
    CustomerProfileModalComponent
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit {
  customerDashboardData!: CustomerDashboardData;
  showProfileModal = false;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCustomerDetails();
  }

  loadCustomerDetails() {
    const customerEmail = this.authService.getCurrentCustomerEmail();

    if (!customerEmail) {
      this.router.navigate(['/customer-sign-in']);
      return;
    }

    this.customerService.getCustomerDetails(customerEmail).subscribe({
      next: (response) => {
        this.customerDashboardData = {
          customerDetails: {
            name: response.customer.name,
            email: response.customer.email,
            totalTicketsPurchased: response.totalTicketsPurchased,
            isActive: response.isActive,
            ticketsToPurchase: response.customer.ticketsToPurchase,
            ticketRetrievalInterval: response.customer.ticketRetrievalInterval
          },
          purchaseStatistics: {
            totalSpent: this.calculateTotalSpent(response.totalTicketsPurchased),
            averageTicketsPerPurchase: this.calculateAverageTicketsPerPurchase(),
            lastMonthPurchases: this.calculateLastMonthPurchases()
          }
        };
      },
      error: (error) => {
        console.error('Failed to load customer details', error);
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

  // Helper methods for calculating purchase statistics
  private calculateTotalSpent(totalTicketsPurchased: number): number {
    const averageTicketPrice = 50;
    return totalTicketsPurchased * averageTicketPrice;
  }

  private calculateAverageTicketsPerPurchase(): number {
    return 2;
  }

  private calculateLastMonthPurchases(): number {
    return this.calculateTotalSpent(40) * 0.75;
  }
}