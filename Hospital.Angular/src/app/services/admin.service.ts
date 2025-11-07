import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiResponseModel } from '../models/ApiResponseModel';
import { ActionTypes } from '../models/UploadFileModel';
import { PagingFilterModel } from '../models/PagingFilterModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ============================== Admissions ==============================

  GetAllAdmissionData(PagingFilter: PagingFilterModel, PatientId: number) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'Admissions/GetAllAdmissionData?PatientId=' + PatientId, PagingFilter);
  }

  GetAdmissionById(AdmissionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'Admissions/GetAdmissionById?AdmissionId=' + AdmissionId);
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

  GetAllSurgicalIntervention(PagingFilter: PagingFilterModel, AdmissionId: number) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/GetAllSurgicalIntervention?AdmissionId=' + AdmissionId, PagingFilter);
  }

  GetSurgicalInterventionById(SurgicalInterventionId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'SurgicalInterventions/GetSurgicalInterventionById?SurgicalInterventionId=' + SurgicalInterventionId);
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

  GetAllFollowUpData(PagingFilter: PagingFilterModel, SurgicalInterventionId: number) {
    return this.http.post<ApiResponseModel<any>>(this.Url + 'FollowUps/GetAllFollowUpData?SurgicalInterventionId=' + SurgicalInterventionId, PagingFilter);
  }

  GetFollowUpById(FollowUpId: number) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'FollowUps/GetFollowUpById?FollowUpId=' + FollowUpId);
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

  // ============================== Patients ==============================

  GetFilesByActionId(ActionId: number, ActionType: ActionTypes) {
    return this.http.get<ApiResponseModel<any[]>>(this.Url + 'Patients/GetFilesByActionId?ActionId=' + ActionId + '&ActionType=' + ActionType);
  }

  // ============================== Files ==============================

  DownloadFile(FileName: string, Type: ActionTypes) {
    return this.http.get(this.Url + 'Attachments/DownloadFile?FileName=' + FileName + '&Type=' + Type, {
      responseType: 'blob',
    });
  }

  DeleteFile(AttachmentId: number, FileName: string, Type: ActionTypes) {
    return this.http.get<ApiResponseModel<any>>(this.Url + 'Attachments/DeleteFile?AttachmentId=' + AttachmentId + '&FileName=' + FileName + '&Type=' + Type)
  }
}
