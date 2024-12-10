import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TicketpoolService } from '../../../services/ticketpool.service';
import {
  EventConfigEditModalComponent,
  EventConfigurationUpdateData,
} from '../../../components/event-config-edit-modal/event-config-edit-modal.component';
import { EventConfigCardComponent } from '../../../components/event-config-card/event-config-card.component';
import { LogViewCardComponent } from '../../../components/log-view-card/log-view-card.component';
import { LogEntry, LogViewService } from '../../../services/log-view.service';

interface AdminDashboardData {
  eventConfiguration: {
    eventName: string;
    maxCapacity: number;
    ticketReleaseRate: number;
    customerRetrievalRate: number;
    configured: boolean;
  };
  ticketStatistics: {
    availableTickets: number;
    totalTickets: number;
    vendorTicketDistribution: { [key: string]: number };
    customerTicketDistribution: { [key: string]: number };
  };
  revenueStatistics: {
    totalRevenue: number;
    averageTicketPrice: number;
    lastMonthRevenue: number;
  };
}

interface LogStatistics {
  totalLogs: number;
  logLevelDistribution: { [key: string]: number };
  recentLogs: LogEntry[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    EventConfigEditModalComponent,
    EventConfigCardComponent,
    LogViewCardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  adminDashboardData: AdminDashboardData = {
    eventConfiguration: {
      eventName: '',
      maxCapacity: 0,
      ticketReleaseRate: 0,
      customerRetrievalRate: 0,
      configured: false
    },
    ticketStatistics: {
      availableTickets: 0,
      totalTickets: 0,
      vendorTicketDistribution: {},
      customerTicketDistribution: {}
    },
    revenueStatistics: {
      totalRevenue: 0,
      averageTicketPrice: 0,
      lastMonthRevenue: 0
    }
  };

  logStatistics: LogStatistics = {
    totalLogs: 0,
    logLevelDistribution: {},
    recentLogs: [],
  };

  isEventConfigModalOpen = false;
  errorMessage: string = '';
  isLoading = true;

  constructor(
    private ticketPoolService: TicketpoolService,
    private authService: AuthService,
    private logViewService: LogViewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAdminDashboardData();
    this.loadLogStatistics();
  }

  // load admin dashboard data
  loadAdminDashboardData() {
    this.isLoading = true;
    this.ticketPoolService.getTicketPoolStatus().subscribe({
      next: (status) => {
        this.ticketPoolService.getAllTickets().subscribe({
          next: (tickets) => {
            this.adminDashboardData = {
              eventConfiguration: {
                eventName: status.eventName || '',
                maxCapacity: status.maxCapacity || 0,
                ticketReleaseRate: status.ticketReleaseRate || 0,
                customerRetrievalRate: status.customerRetrievalRate || 0,
                configured: status.configured || false,
              },
              ticketStatistics: {
                availableTickets: status.availableTickets || 0,
                totalTickets: tickets.length || 0,
                vendorTicketDistribution:
                  this.ticketPoolService.calculateVendorTicketDistribution(
                    tickets
                  ) || {},
                customerTicketDistribution:
                  this.ticketPoolService.calculateCustomerTicketDistribution(
                    tickets
                  ) || {},
              },
              revenueStatistics: {
                totalRevenue: this.calculateTotalRevenue(tickets.length),
                averageTicketPrice: this.calculateAverageTicketPrice(),
                lastMonthRevenue: this.calculateLastMonthRevenue(
                  tickets.length
                ),
              },
            };
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Failed to load tickets', error);
            this.isLoading = false;
            this.router.navigate(['/admin-sign-in']);
          },
        });
      },
      error: (error) => {
        console.error('Failed to load ticket pool status', error);
        this.isLoading = false;
        this.router.navigate(['/admin-sign-in']);
      },
    });
  }

  // Method to load log statistics
  loadLogStatistics() {
    // Fetch recent logs
    this.logViewService.getLogs().subscribe({
      next: (logs) => {
        this.logStatistics.recentLogs = logs;
        this.logStatistics.totalLogs = logs.length;
      },
      error: (error) => {
        console.error('Failed to load logs', error);
      },
    });

  }

  // Method to refresh log statistics
  refreshLogStatistics() {
    this.loadLogStatistics();
  }

  openEventConfigModal() {
    this.isEventConfigModalOpen = true;
  }

  // Method to save event configuration
  onSaveEventConfig(updatedConfig: EventConfigurationUpdateData) {
    this.ticketPoolService.updateEventConfiguration(updatedConfig).subscribe({
      next: () => {
        this.isEventConfigModalOpen = false;
        this.loadAdminDashboardData();
      },
      error: (error) => {
        this.errorMessage = 'Failed to update event configuration';
        console.error('Event Configuration Update Error:', error);
      },
    });
  }

  onCloseEventConfigModal() {
    this.isEventConfigModalOpen = false;
  }

  onEventConfigError(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  refreshDashboard() {
    this.loadAdminDashboardData();
  }

  logout() {
    const adminUsername = localStorage.getItem('adminUsername');

    if (adminUsername) {
      this.authService.adminLogout(adminUsername).subscribe({
        next: () => {
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('adminToken');
          this.router.navigate(['/admin-sign-in']);
        },
        error: (error) => {
          console.error('Logout failed', error);
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('adminToken');
          this.router.navigate(['/admin-sign-in']);
        },
      });
    }
  }

  // Helper methods for calculating statistics
  private calculateTotalRevenue(totalTickets: number): number {
    const averageTicketPrice = 500;
    return totalTickets * averageTicketPrice;
  }

  private calculateAverageTicketPrice(): number {
    return 500;
  }

  private calculateLastMonthRevenue(totalTickets: number): number {
    return this.calculateTotalRevenue(totalTickets) * 0.75;
  }
}
