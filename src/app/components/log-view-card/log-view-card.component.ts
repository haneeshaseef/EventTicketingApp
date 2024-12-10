import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogEntry, LogViewService } from '../../services/log-view.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-view-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-view-card.component.html',
  styles: []
})
export class LogViewCardComponent implements OnInit, OnDestroy {
  logs: LogEntry[] = [];
  displayedLogs: LogEntry[] = [];
  isConnected: boolean = false;

  private logSubscription!: Subscription;
  private connectionSubscription!: Subscription;

  constructor(private logViewService: LogViewService) {}

  ngOnInit() {
    this.logViewService.fetchInitialLogs(50).subscribe({
      next: (initialLogs) => {
        this.logs = initialLogs;
        this.displayedLogs = this.logs.slice(-50);
      },
      error: (error) => {
        console.error('Failed to fetch initial logs', error);
      }
    });

    this.logSubscription = this.logViewService.getLogs().subscribe(
      updatedLogs => {
        this.logs = updatedLogs;
        this.displayedLogs = this.logs.slice(-50);
      }
    );

    this.connectionSubscription = this.logViewService.getConnectionStatus().subscribe(
      connected => {
        this.isConnected = connected;
      }
    );
  }

  ngOnDestroy() {
    this.logSubscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
  }
}