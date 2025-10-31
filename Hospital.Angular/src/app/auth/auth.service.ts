import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements  CanActivate {
  private http = inject(HttpClient);
  private router = inject(Router);

  get UserModel() {
    return JSON.parse(localStorage.getItem('UserModel'));
  }

  loginRedirect(): void {
    localStorage.removeItem('UserModel');
    this.router.navigateByUrl('/');
  }

  getUserInfo() {
    return this.UserModel;
  }

  get userId(): string {
    return this.UserModel?.userId;
  }

  get userName(): string {
    return this.UserModel?.userName;
  }

  get userRole(): string {
    return this.UserModel?.role;
  }
  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token'); // or use a service
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
