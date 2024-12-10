import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './admin-sign-in.component.html',
  styleUrl: './admin-sign-in.component.css',
})
export class AdminSignInComponent {
  adminSignInForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    //Ref: https://angular.io/guide/reactive-forms
    this.adminSignInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.adminSignInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onAdminSubmit(): void {
    if (this.adminSignInForm.valid) {
      const { username, password } = this.adminSignInForm.value;

      this.authService.adminLogin(username, password).subscribe({
        next: (response) => {
          this.router.navigate(['/admin-dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Invalid admin credentials. Please try again.';
        },
      });
    }
  }


  navigateToVendorSignUp() {
    this.router.navigate(['/vendor-sign-up']);
  }
}
