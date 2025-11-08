import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  @ViewChild('LoginForm') LoginForm: any;
  isShowPassword = false;
  LoginModel: LoginModel = {} as LoginModel;
  ErrorMessage = '';
  showPassword = false;
  loading = false;
  constructor(private authService: AuthService, private router: Router, private toaster: ToastrService) {

  }

  Login() {
    this.LoginForm.onSubmit();
    const isValid = this.LoginForm.form.valid;
    if (!isValid)
      return;
    this.authService.AdminLogin(this.LoginModel).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        localStorage.setItem('UserModel', JSON.stringify(data.results));
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.toaster.error(data.message);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

export interface LoginModel {
  userName: string,
  password: string,
}


