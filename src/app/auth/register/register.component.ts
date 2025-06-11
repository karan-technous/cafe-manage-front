import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Validate passwords match
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.toastr.error('Please make sure your passwords match', 'Password Mismatch', {
        timeOut: 4000,
        positionClass: 'toast-top-right'
      });
      this.isLoading = false;
      return;
    }

    // Call register API
    this.authService.registerUser({
      name: this.formData.name,
      username: this.formData.username,
      email: this.formData.email,
      password: this.formData.password
    }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.toastr.success(
          `<strong>Welcome ${this.formData.name}!</strong><br>Your account has been created successfully.`,
          'Registration Successful',
          {
            timeOut: 4000,
            positionClass: 'toast-top-right',
            enableHtml: true
          }
        );
        // Redirect to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.toastr.error(
          `<strong>Registration Failed</strong><br>${this.errorMessage}`,
          'Error',
          {
            timeOut: 4000,
            positionClass: 'toast-top-right',
            enableHtml: true
          }
        );
        this.isLoading = false;
      }
    });
  }
}
