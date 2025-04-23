import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginRequest} from '../../core/interface/auth/login-request.interface';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const loginData: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        // Get user role to redirect accordingly
        const userRole = this.authService.getUserRole();
        console.log("User role:", userRole);
        console.log("Type of user role:", typeof userRole);

        if (userRole && userRole.includes('ROLE_ADMIN')) {
          console.log("inside of the condition ifff :", userRole);
          this.router.navigate(['/admin/dashboard']);
        }
        else if(userRole && userRole.includes("ROLE_USER")){
            this.router.navigate(['/home']);
        }
        else {
          console.log("inside of the condition elseeee :", userRole);
          this.router.navigate(['/login']);
        }

      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    });
  }

}
