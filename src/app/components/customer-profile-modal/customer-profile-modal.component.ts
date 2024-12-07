import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerUpdateData } from '../../services/customer.service';

@Component({
  selector: 'app-customer-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profile-modal.component.html',
  styleUrl: './customer-profile-modal.component.css'
})
export class CustomerProfileModalComponent {
  @Input() initialData!: CustomerUpdateData;
  @Output() saveProfileEvent = new EventEmitter<CustomerUpdateData>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() errorEvent = new EventEmitter<string>();

  customerData: CustomerUpdateData = {};
  validationErrors: string[] = [];

  ngOnInit() {
    // Clone the initial data to avoid direct mutation
    this.customerData = { ...this.initialData };
  }

  validateProfile(): boolean {
    this.validationErrors = [];

    // Example validation rules
    if (!this.customerData.name || this.customerData.name.trim() === '') {
      this.validationErrors.push('Name is required');
    }

    if (!this.customerData.email || !this.isValidEmail(this.customerData.email)) {
      this.validationErrors.push('Valid email is required');
    }

    if (this.customerData.ticketsToPurchase && this.customerData.ticketsToPurchase < 0) {
      this.validationErrors.push('Tickets to purchase must be a positive number');
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
        this.saveProfileEvent.emit(this.customerData);
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