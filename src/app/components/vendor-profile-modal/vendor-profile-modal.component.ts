import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VendorService, VendorUpdateData } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-profile-modal.component.html',
  styleUrl: './vendor-profile-modal.component.css',
})
export class VendorProfileModalComponent {
  @Input() initialData!: VendorUpdateData;
  @Output() saveProfileEvent = new EventEmitter<VendorUpdateData>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() errorEvent = new EventEmitter<string>();

  vendorData: VendorUpdateData = {};

  validationErrors: string[] = [];

  ngOnInit() {
    // Clone the initial data to avoid direct mutation
    this.vendorData = { ...this.initialData };
  }

  validateProfile(): boolean {
    this.validationErrors = [];

    // Validation rules
    if (!this.vendorData.name || this.vendorData.name.trim() === '') {
      this.validationErrors.push('Vendor name is required');
    }

    if (!this.vendorData.email || !this.isValidEmail(this.vendorData.email)) {
      this.validationErrors.push('Valid email is required');
    }

    if (
      !this.vendorData.ticketsPerRelease ||
      this.vendorData.ticketsPerRelease <= 0
    ) {
      this.validationErrors.push(
        'Tickets per release must be a positive number'
      );
    }

    if (
      !this.vendorData.ticketReleaseInterval ||
      this.vendorData.ticketReleaseInterval <= 0
    ) {
      this.validationErrors.push(
        'Ticket release interval must be a positive number'
      );
    }

    return this.validationErrors.length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  saveProfileHandler() {
    if (this.validateProfile()) {
      try {
        // Emit the updated vendor data
        this.saveProfileEvent.emit(this.vendorData);
      } catch (error) {
        // Emit any unexpected errors
        this.errorEvent.emit(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        );
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
