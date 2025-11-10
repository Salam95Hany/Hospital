import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../models/ApiResponseModel';
import { PagingFilterModel } from '../models/PagingFilterModel';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  apiURL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // ========================================= Auth =========================================

  GetAllUsers() {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Auth/GetAllUsers');
  }

  CreateUser(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/CreateUser', Model);
  }

  EditUser(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/EditUser', Model);
  }

  DeleteUser(UserId: string) {
    return this.http.get<ApiResponseModel<any>>(this.apiURL + 'Auth/DeleteUser?UserId=' + UserId);
  }

  GetUserInfoById(UserId: string) {
    return this.http.get<any>(this.apiURL + 'Auth/GetUserInfoById?UserId=' + UserId);
  }

  EditUserProfile(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/EditUserProfile', Model);
  }

  ChangeUserPassword(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.apiURL + 'Auth/ChangeUserPassword', Model);
  }
}
