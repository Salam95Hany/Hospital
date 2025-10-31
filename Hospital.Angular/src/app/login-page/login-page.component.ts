import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

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
  constructor(private authService: AuthService, private router: Router) {

  }

  Login() {
    // this.LoginForm.onSubmit();
    // const isValid = this.LoginForm.form.valid;
    // if (!isValid)
    //   return;

    // this.loading = true;
    // this.authService.AdminLogin(this.LoginModel).subscribe(data => {
    //   debugger;
    //   this.loading = false;
    //   if (data.isSuccess) {
    //     localStorage.setItem('UserModel', JSON.stringify(data.results));
    
    // Set a dummy token to bypass authentication
    localStorage.setItem('token', 'dummy-auth-token');
    localStorage.setItem('UserModel', JSON.stringify({ 
      userId: '1', 
      userName: this.LoginModel.userName || 'Demo User', 
      role: 'admin' 
    }));
    
    this.router.navigate(['/dashboard']);
    //   } else
    //     this.ErrorMessage = data.message;
    // });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

export interface LoginModel {
  userName: string,
  password: string,
}


