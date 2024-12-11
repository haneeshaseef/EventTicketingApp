import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-customer-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './customer-sign-up.component.html',
  styleUrl: './customer-sign-up.component.css',
})
export class CustomerSignUpComponent implements OnInit {
  customerSignupForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerSignupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ticketsToPurchase: ['', [Validators.required, Validators.min(1)]],
      ticketRetrievalInterval: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.customerSignupForm.valid) {
      const customerData = this.customerSignupForm.value;

      this.authService.customerRegister(customerData).subscribe({
        next: (response) => {
          console.log('Customer registered successfully', response);
          this.router.navigate(['/customer-sign-in']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
        },
      });
    }
  }

  navigateToCustomerLogin() {
    this.router.navigate(['/customer-sign-in']);
  }

  navigateToVendorSignup() {
    this.router.navigate(['/vendor-sign-up']);
  }
}
