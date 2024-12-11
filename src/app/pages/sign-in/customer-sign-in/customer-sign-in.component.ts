import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './customer-sign-in.component.html',
  styleUrl: './customer-sign-in.component.css'
})
export class CustomerSignInComponent {
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
      this.authService.customerLogin(this.loginForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/customer-dashboard']);
        },
        error: (error) => {
          this.router.navigate(['/customer-sign-in']);
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }

  navigateToRegister() {
    this.router.navigate(['/customer-sign-up']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToVendorLogin() {
    this.router.navigate(['/vendor-sign-in']);
  }
}
