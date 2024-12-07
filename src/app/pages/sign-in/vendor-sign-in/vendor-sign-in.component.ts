import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vendor-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './vendor-sign-in.component.html',
  styleUrl: './vendor-sign-in.component.css'
})
export class VendorSignInComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.vendorLogin(this.loginForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/vendor-dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }

  navigateToVendorSignUp() {
    this.router.navigate(['/vendor-sign-up']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/vendor-forgot-password']);
  }

  navigateToCustomerLogin() {
    this.router.navigate(['/customer-sign-in']);
  }
}