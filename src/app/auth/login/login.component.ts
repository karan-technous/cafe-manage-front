import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EMAIL_NAME, setLocaStorage, TOKEN_NAME } from '../../utils/token';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formData = {
    email: "",
    password: ""
  }
  isLoading = false;

  constructor(
    private authService: AuthServiceService, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  onchange(event: any) {
    const target = event.target as HTMLInputElement;
    this.formData = {
      ...this.formData,
      [target.name]: target.value
    };
  }

  async handleSubmitForm(event: any) {
    try {
      event.preventDefault();
      this.isLoading = true;
      
      console.log("the formdata=", this.formData);
      const response: any = await firstValueFrom(
        this.authService.loginUser(JSON.stringify(this.formData))
      );

      this.toastr.success(
        `<strong>Welcome back!</strong><br>You have successfully logged in.`,
        'Login Successful',
        {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          enableHtml: true
        }
      );

      setLocaStorage(TOKEN_NAME, response?.data?.token);
      setLocaStorage(EMAIL_NAME, response?.data?.email);
      console.log(response?.data);
      
      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 1500);

    } catch (err: any) {
      console.log(err);
      this.toastr.error(
        `<strong>Login Failed</strong><br>${err.error.error.error[0] || 'Please check your credentials and try again.'}`,
        'Error',
        {
          timeOut: 4000,
          positionClass: 'toast-top-right',
          enableHtml: true
        }
      );
    } finally {
      this.isLoading = false;
    }
  }
}
