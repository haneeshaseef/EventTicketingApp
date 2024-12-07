import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { VendorService } from '../../../services/vendor.service';

interface VendorDashboardData {
  vendorDetails: {
    name: string;
    email: string;
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
    CommonModule
  ],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent {
  vendorDashboardData!: VendorDashboardData;

  constructor(
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router) {

  }

  ngOnInit() {
    this.loadVenderDetails();
  }

  loadVenderDetails(){
    const vendorEmail = this.authService.getCurrentVendorEmail();

    if (!vendorEmail) {
      this.router.navigate(['/vendor-sign-in']);
      return;
    }

    // Fetch vendor details and sales statistics
    this.vendorService.getVendorDetails(vendorEmail).subscribe({
      next: (response) => {
        this.vendorDashboardData = {
          vendorDetails: {
            name: response.vendor.name,
            email: response.vendor.email,
            totalTicketsSold: response.totalTicketsSold,
            isActive: response.isActive,
            ticketsPerRelease: response.vendor.ticketsPerRelease,
            ticketReleaseInterval: response.vendor.ticketReleaseInterval
          },
          salesStatistics: {
            totalRevenue: this.calculateTotalRevenue(response.totalTicketsSold),
            averageTicketsPerSale: this.calculateAverageTicketsPerSale(),
            lastMonthSales: this.calculateLastMonthSales()
          }
        };
      },
      error: (error) => {
        console.error('Failed to load vendor details', error);
        this.router.navigate(['/vendor-sign-in']);
      }
    });
  }

  openEditProfile() {
    // Navigate to edit profile page or open a modal
    this.router.navigate(['/vendor/edit-profile']);
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

  // Helper methods for calculating sales statistics
  private calculateTotalRevenue(totalTicketsSold: number): number {
    const averageTicketPrice = 50;
    return totalTicketsSold * averageTicketPrice;
  }

  private calculateAverageTicketsPerSale(): number {
    return 2.5;
  }

  private calculateLastMonthSales(): number {
    return this.calculateTotalRevenue(50) * 0.75;
  }
}
