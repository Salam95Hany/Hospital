import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiResponseModel } from '../models/ApiResponseModel';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURL = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private _userModel: any;

  get UserModel() {
    if (!this._userModel) {
      const json = localStorage.getItem('UserModel');
      this._userModel = json ? JSON.parse(json) : null;
    }
    return this._userModel;
  }

  get userId(): string {
    return this.UserModel?.userId;
  }

  AdminLogin(model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/AdminLogin', model);
  }

  AdminLogout(UserId: string) {
    return this.http.get<any>(this.apiURL + 'Auth/AdminLogout?UserId=' + UserId);
  }

  loginRedirect(): void {
    this._userModel = null;
    localStorage.removeItem('UserModel');
    this.router.navigateByUrl('/');
  }

  isAuthenticated(): boolean {
    const currentUser = this.UserModel;
    if (!currentUser || this.isTokenExpired())
      return false;
    return true;
  }

  isTokenExpired(): boolean {
    const access_token = this.UserModel?.token;
    if (!access_token) return true;
    const decode: any = jwtDecode(access_token);
    if (!decode.exp) return true;
    const expirationDate = decode.exp * 1000;
    const now = new Date().getTime();
    return expirationDate < now;
  }

  isInRole(roles: string[]): boolean {
    let userModel = this.UserModel;
    if (!userModel)
      return false;

    let ckeckRole = roles.some(i => i == userModel?.role);
    return ckeckRole;
  }
}
