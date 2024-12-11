import { Component } from '@angular/core';
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
  selector: 'app-vendor-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './vendor-sign-up.component.html',
  styleUrl: './vendor-sign-up.component.css',
})
export class VendorSignUpComponent {
  vendorSignupForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorSignupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      ticketsPerRelease: ['', [Validators.required, Validators.min(1)]],
      ticketReleaseInterval: ['', [Validators.required, Validators.min(1)]],
      ticketsToSell: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.vendorSignupForm.valid) {
      const vendorData = this.vendorSignupForm.value;

      this.authService.vendorRegister(vendorData).subscribe({
        next: (response) => {
          console.log('Vendor registered successfully', response);
          this.router.navigate(['/vendor-sign-in']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
        },
      });
    }
  }

  navigateToVendorLogin() {
    this.router.navigate(['/vendor-sign-in']);
  }

  navigateToCustomerSignup() {
    this.router.navigate(['/customer-sign-up']);
  }

  navigateToAdminLogin() {
   this.router.navigate(['/admin-sign-in']);
    }
}
