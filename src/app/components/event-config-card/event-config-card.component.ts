import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventConfigEditModalComponent } from '../event-config-edit-modal/event-config-edit-modal.component';

export interface EventConfigurationData {
  eventName?: string;
  maxCapacity?: number;
  ticketReleaseRate?: number;
  customerRetrievalRate?: number;
  configured?: boolean;
}

@Component({
  selector: 'app-event-config-card',
  standalone: true,
  imports: [CommonModule, EventConfigEditModalComponent],
  templateUrl: './event-config-card.component.html',
  styleUrl: './event-config-card.component.css',
})
export class EventConfigCardComponent {
  //Ref: https://angular.io/api/core/Input
  @Input() eventConfigurationData: EventConfigurationData = {};
  @Input() showCard: boolean = false;
  @Input() isEditable: boolean = false;

  //Ref: https://angular.io/api/core/Output
  @Output() saveConfigEvent = new EventEmitter<EventConfigurationData>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() errorEvent = new EventEmitter<string>();

  isEventConfigModalOpen = false;

  // open the event configuration modal
  openEventConfigModal() {
    if (this.isEditable) {
      this.isEventConfigModalOpen = true;
    }
  }

  // save the event configuration data
  onSaveEventConfig(config: EventConfigurationData) {
    if (this.isEditable) {
      this.saveConfigEvent.emit(config);
      this.isEventConfigModalOpen = false;
    }
  }

  // close the event configuration modal
  onCloseEventConfigModal() {
    this.isEventConfigModalOpen = false;
    this.closeModalEvent.emit();
  }

  // handle event configuration error
  onEventConfigError(error: string) {
    this.errorEvent.emit(error);
    console.error('Event config error:', error);
  }
}
