import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponseModel } from '../models/ApiResponseModel';
import { FilterModel } from '../models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ============================== Admissions ==============================

  GetAllAdmissionData(PatientId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'Admissions/GetAllAdmissionData?PatientId=' + PatientId);
  }

  GetAllAdmissionFilters(PatientId: number) {
    return this.http.get<ApiResponseModel<FilterModel[]>>(this.Url + 'Admissions/GetAllAdmissionFilters?PatientId=' + PatientId);
  }

  AddNewAdmission(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'Admissions/AddNewAdmission', Model);
  }

  UpdateAdmission(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'Admissions/UpdateAdmission', Model);
  }

  DeleteAdmission(AdmissionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'Admissions/DeleteAdmission?AdmissionId=' + AdmissionId);
  }
}
