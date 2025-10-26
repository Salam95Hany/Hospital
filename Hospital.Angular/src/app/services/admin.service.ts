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

  GetAdmissionById(AdmissionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'Admissions/GetAdmissionById?AdmissionId=' + AdmissionId);
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

  // ============================== SurgicalInterventions ==============================

  GetAllSurgicalIntervention(AdmissionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/GetAllSurgicalIntervention?AdmissionId=' + AdmissionId);
  }

  GetSurgicalInterventionById(SurgicalInterventionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/GetSurgicalInterventionById?SurgicalInterventionId=' + SurgicalInterventionId);
  }

  GetAllSurgicalInterventionFilters(AdmissionId: number) {
    return this.http.get<ApiResponseModel<FilterModel[]>>(this.Url + 'SurgicalInterventions/GetAllSurgicalInterventionFilters?AdmissionId=' + AdmissionId);
  }

  AddNewSurgicalIntervention(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/AddNewSurgicalIntervention', Model);
  }

  UpdateSurgicalIntervention(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/UpdateSurgicalIntervention', Model);
  }

  DeleteSurgicalIntervention(SurgicalInterventionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/DeleteSurgicalIntervention?SurgicalInterventionId=' + SurgicalInterventionId);
  }

  // ============================== FollowUps ==============================

  GetAllFollowUpData(SurgicalInterventionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'FollowUps/GetAllFollowUpData?SurgicalInterventionId=' + SurgicalInterventionId);
  }

  GetFollowUpById(FollowUpId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'FollowUps/GetFollowUpById?FollowUpId=' + FollowUpId);
  }

  GetAllFollowUpFilters(SurgicalInterventionId: number) {
    return this.http.get<ApiResponseModel<FilterModel[]>>(this.Url + 'FollowUps/GetAllFollowUpFilters?SurgicalInterventionId=' + SurgicalInterventionId);
  }

  AddNewFollowUp(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'FollowUps/AddNewFollowUp', Model);
  }

  UpdateFollowUp(Model: any) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'FollowUps/UpdateFollowUp', Model);
  }

  DeleteFollowUp(FollowUpId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'FollowUps/DeleteFollowUp?FollowUpId=' + FollowUpId);
  }
}
