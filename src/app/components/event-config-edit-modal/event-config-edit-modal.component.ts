import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketpoolService } from '../../services/ticketpool.service';


export interface EventConfigurationUpdateData {
  eventName?: string;
  maxCapacity?: number;
  ticketReleaseRate?: number;
  customerRetrievalRate?: number;
}

@Component({
  selector: 'app-event-config-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-config-edit-modal.component.html',
  styleUrl: './event-config-edit-modal.component.css'
})
export class EventConfigEditModalComponent {
  @Input() initialData!: EventConfigurationUpdateData;
  @Output() saveConfigEvent = new EventEmitter<EventConfigurationUpdateData>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() errorEvent = new EventEmitter<string>();

  configData: EventConfigurationUpdateData = {};
  validationErrors: string[] = [];

  constructor(private ticketpoolService: TicketpoolService) {}

  ngOnInit() {
    this.configData = { ...this.initialData };
  }

  // Validate the configuration data
  validateConfiguration(): boolean {
    this.validationErrors = [];

    if (!this.configData.eventName || this.configData.eventName.trim() === '') {
      this.validationErrors.push('Event name is required');
    }

    if (this.configData.maxCapacity === undefined || this.configData.maxCapacity <= 0) {
      this.validationErrors.push('Max capacity must be a positive number');
    }

    if (this.configData.ticketReleaseRate === undefined || this.configData.ticketReleaseRate < 0) {
      this.validationErrors.push('Ticket release rate must be a non-negative number');
    }

    if (this.configData.customerRetrievalRate === undefined || this.configData.customerRetrievalRate < 0) {
      this.validationErrors.push('Customer retrieval rate must be a non-negative number');
    }

    return this.validationErrors.length === 0;
  }

  // Save the configuration data
  saveConfigHandler() {
    if (this.validateConfiguration()) {
      try {
        this.ticketpoolService.updateEventConfiguration(this.configData).subscribe({
          next: (updatedConfig) => {
            this.saveConfigEvent.emit(updatedConfig);
          },
          error: (error) => {
            // Emit any API errors
            this.errorEvent.emit(error.message || 'Failed to update event configuration');
          }
        });
      } catch (error) {
        // Emit any unexpected errors
        this.errorEvent.emit(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    } else {
      // Emit validation errors
      this.errorEvent.emit(this.validationErrors.join(', '));
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
