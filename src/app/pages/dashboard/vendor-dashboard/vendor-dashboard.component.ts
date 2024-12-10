import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { VendorService, VendorUpdateData } from '../../../services/vendor.service';
import { VendorProfileModalComponent } from '../../../components/vendor-profile-modal/vendor-profile-modal.component';
import { EventConfigCardComponent } from '../../../components/event-config-card/event-config-card.component';
import { TicketpoolService } from '../../../services/ticketpool.service';

interface VendorDashboardData {
  eventConfiguration: {
    eventName: string;
    maxCapacity: number;
    ticketReleaseRate: number;
    customerRetrievalRate: number;
    configured: boolean;
  };
  vendorDetails: {
    name: string;
    email: string;
    ticketsTosell: number;
    totalTicketsSold: number;
    isActive: boolean;
    ticketsPerRelease: number;
    ticketReleaseInterval: number;
  };
  salesStatistics: {
    totalRevenue: number;
    averageTicketsPerSale: number;
    lastMonthSales: number;
  };
}

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    VendorProfileModalComponent,
    EventConfigCardComponent
  ],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
//Ref: https://angular.io/guide/dependency-injection-providers
export class VendorDashboardComponent implements OnInit {
  vendorDashboardData!: VendorDashboardData;
  showProfileModal = false;
  errorMessage: string = '';

  constructor(
    private vendorService: VendorService,
    private ticketPoolService: TicketpoolService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVendorDashboardData();
  }

  // Load vendor dashboard data from the server
  loadVendorDashboardData() {
    const vendorEmail = this.authService.getCurrentVendorEmail();

    if (!vendorEmail) {
      this.router.navigate(['/vendor-sign-in']);
      return;
    }
    this.ticketPoolService.getTicketPoolStatus().subscribe({
      next: (eventStatus) => {
        this.vendorService.getVendorDetails(vendorEmail).subscribe({
          next: (response) => {
            this.vendorDashboardData = {
              eventConfiguration: {
                eventName: eventStatus.eventName,
                maxCapacity: eventStatus.maxCapacity,
                ticketReleaseRate: eventStatus.ticketReleaseRate,
                customerRetrievalRate: eventStatus.customerRetrievalRate,
                configured: eventStatus.configured
              },
              vendorDetails: {
                name: response.vendor.name,
                email: response.vendor.email,
                ticketsTosell: response.vendor.ticketsTosell,
                totalTicketsSold: response.vendor.totalTicketsSold,
                isActive: response.vendor.isActive,
                ticketsPerRelease: response.vendor.ticketsPerRelease,
                ticketReleaseInterval: response.vendor.ticketReleaseInterval
              },
              salesStatistics: {
                totalRevenue: this.calculateTotalRevenue(response.vendor.totalTicketsSold),
                averageTicketsPerSale: this.calculateAverageTicketsPerSale(),
                lastMonthSales: this.calculateLastMonthSales()
              }
            };
          },
          error: (error) => {
            console.error('Failed to load vendor details', error);
            this.errorMessage = 'Failed to load vendor details';
            this.router.navigate(['/vendor-sign-in']);
          }
        });
      },
      error: (error) => {
        console.error('Failed to load event configuration', error);
        this.errorMessage = 'Failed to load event configuration';
        this.router.navigate(['/vendor-sign-in']);
      }
    });
  }

  openEditProfile() {
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  updateProfile(updatedData: VendorUpdateData) {
    const vendorEmail = this.authService.getCurrentVendorEmail();
    
    if (!vendorEmail) return;

    this.vendorService.updateVendorProfile(vendorEmail, updatedData).subscribe({
      next: (response) => {
        // Update local data with response and update to data based on the response
        this.vendorDashboardData.vendorDetails = {
          ...this.vendorDashboardData.vendorDetails,
          ...updatedData
        };
        this.closeProfileModal();
      },
      error: (error) => {
        console.error('Failed to update profile', error);
      }
    });
  }

  logout() {
    const vendorEmail = localStorage.getItem('vendorEmail');
    
    if (vendorEmail) {
      this.authService.vendorLogout(vendorEmail).subscribe({
        next: () => {
          localStorage.removeItem('vendorEmail');
          localStorage.removeItem('vendorToken');
          this.router.navigate(['/vendor-sign-in']);
        },
        error: (error) => {
          console.error('Logout failed', error);
          // Force logout even if server call fails
          localStorage.removeItem('vendorEmail');
          localStorage.removeItem('vendorToken');
          this.router.navigate(['/vendor-sign-in']);
        }
      });
    }
  }

  // Vendor operations
  stopVendorOperation() {
    const vendorName = this.vendorDashboardData.vendorDetails.name;
    
    this.vendorService.stopTicketRelease(vendorName).subscribe({
      next: (response) => {
        // Update the local state to reflect the change
        this.vendorDashboardData.vendorDetails.isActive = false;
        console.log('Ticket release stopped successfully');
      },
      error: (error) => {
        console.error('Failed to stop ticket release', error);
      }
    });
  }

  // Vendor operations
  startVendorOperation() {
    const vendorName = this.vendorDashboardData.vendorDetails.name;
    
    this.vendorService.startTicketRelease(vendorName).subscribe({
      next: (response) => {
        // Update the local state to reflect the change
        this.vendorDashboardData.vendorDetails.isActive = true;
        console.log('Ticket release started successfully');
      },
      error: (error) => {
        console.error('Failed to start ticket release', error);
      }
    });
  }

  // Helper methods for calculating sales statistics
  private calculateTotalRevenue(totalTicketsSold: number): number {
    const averageTicketPrice = 500;
    return totalTicketsSold * averageTicketPrice;
  }

  private calculateAverageTicketsPerSale(): number {
    return 2.5;
  }

  private calculateLastMonthSales(): number {
    return this.calculateTotalRevenue(50) * 0.75;
  }
}