import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientData, PatientsList, Admission } from '../models/patient.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseModel } from '../models/ApiResponseModel';
import { PagingFilterModel } from '../models/PagingFilterModel';
import { environment } from '../../environments/environment';
import { FilterModel } from '../models/FilterModel';

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PatientFilterParams {
  searchTerm?: string;
  governorate?: string;
  gender?: string;
  ageRange?: { min?: number; max?: number };
  admissionDateRange?: { from?: Date; to?: Date };
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl; // Adjust the URL as needed
  private patients: PatientData[] = [];

  constructor(private http: HttpClient) { }

  // New method to add a full patient record
  AddNewPatientFull(patientData: any): Observable<ApiResponseModel<any>> {
    return this.http.post<ApiResponseModel<any>>(`${this.apiUrl}Patients/AddNewPatientFull`, patientData);
  }
  updatePatientFull(patientData: any): Observable<ApiResponseModel<any>> {
    return this.http.put<ApiResponseModel<any>>(`${this.apiUrl}Patients/UpdatePatientFull`, patientData);
  }

  // New method to get basic patient info
  getAllPatientsBasicInfo(PagingFilter: PagingFilterModel): Observable<any> {
    return this.http.post<ApiResponseModel<any>>(`${this.apiUrl}Patients/GetAllPatientsBasicInfo`, PagingFilter);
  }

  GetAllPatientFilters(): Observable<any> {
    return this.http.get<ApiResponseModel<FilterModel[]>>(`${this.apiUrl}Patients/GetAllPatientFilters`);
  }

  // GetAllPatientsBasicInfoFilter(PagingFilter: PagingFilterModel) {
  //   return this.http.post<any[]>(`${this.apiUrl}Patients/GetAllPatientsBasicInfoFilter`, PagingFilter);
  // }

  // Get patients with pagination and filtering
  getPatientsWithPagination(pagination: PaginationParams, filters?: PatientFilterParams): Observable<any> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

    if (pagination.sortBy) {
      params = params.set('sortBy', pagination.sortBy);
    }
    if (pagination.sortOrder) {
      params = params.set('sortOrder', pagination.sortOrder);
    }

    // Add filter parameters
    if (filters) {
      if (filters.searchTerm) {
        params = params.set('searchTerm', filters.searchTerm);
      }
      if (filters.governorate) {
        params = params.set('governorate', filters.governorate);
      }
      if (filters.gender) {
        params = params.set('gender', filters.gender);
      }
      if (filters.ageRange?.min !== undefined) {
        params = params.set('minAge', filters.ageRange.min.toString());
      }
      if (filters.ageRange?.max !== undefined) {
        params = params.set('maxAge', filters.ageRange.max.toString());
      }
      if (filters.admissionDateRange?.from) {
        params = params.set('admissionDateFrom', filters.admissionDateRange.from.toISOString());
      }
      if (filters.admissionDateRange?.to) {
        params = params.set('admissionDateTo', filters.admissionDateRange.to.toISOString());
      }
    }

    return this.http.get<any>(`${this.apiUrl}Patients/GetPatientsWithPagination`, { params });
  }

  // Get filtered patients count for pagination
  getFilteredPatientsCount(filters?: PatientFilterParams): Observable<number> {
    let params = new HttpParams();

    if (filters) {
      if (filters.searchTerm) {
        params = params.set('searchTerm', filters.searchTerm);
      }
      if (filters.governorate) {
        params = params.set('governorate', filters.governorate);
      }
      if (filters.gender) {
        params = params.set('gender', filters.gender);
      }
      if (filters.ageRange?.min !== undefined) {
        params = params.set('minAge', filters.ageRange.min.toString());
      }
      if (filters.ageRange?.max !== undefined) {
        params = params.set('maxAge', filters.ageRange.max.toString());
      }
      if (filters.admissionDateRange?.from) {
        params = params.set('admissionDateFrom', filters.admissionDateRange.from.toISOString());
      }
      if (filters.admissionDateRange?.to) {
        params = params.set('admissionDateTo', filters.admissionDateRange.to.toISOString());
      }
    }

    return this.http.get<number>(`${this.apiUrl}Patients/GetFilteredPatientsCount`, { params });
  }

  getPatients(): Observable<PatientData[]> {
    return of(this.patients);
  }

  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Patients/GetPatientByIdWithInclude/${id}`);
  }

  getPatientLastDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Patients/GetPatientWithLastDetailsAsync/${id}`);
  }


  deletePatientWithAllData(patientId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}Patients/DeletePatientWithAllData/${patientId}`);
  }

  GetSearchAutoCompleteData(Model: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Patients/GetSearchAutoCompleteData`, Model);
  }

  GetDashboardStatistics() {
    return this.http.get<any>(`${this.apiUrl}Patients/GetDashboardStatistics`);
  }



  addPatient(patient: PatientData): Observable<PatientData> {
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = Math.max() + 1;

    const newPatient: PatientData = {
      ...patient,
    };

    this.patients.push(newPatient);
    return of(newPatient);
  }

  updatePatient(patient: PatientData): Observable<PatientData> {
    const index = this.patients.indexOf(patient);
    if (index !== -1) {
      this.patients[index] = {
        ...patient,
      };
      return of(this.patients[index]);
    }
    return of(patient); // Return original if not found
  }

  deletePatient(id: number): Observable<boolean> {
    const initialLength = this.patients.length;
    this.patients = this.patients;
    return of(this.patients.length !== initialLength);
  }

  // Validate hospital file number existence for admission create flow
  GetHospitalFileNumber(hospitalFileNumber: string): Observable<Admission[]> {
    const params = new HttpParams().set('hospitalFileNumber', hospitalFileNumber ?? '');
    return this.http.get<Admission[]>(`${this.apiUrl}Patients/GetHospitalFileNumber`, { params });
  }

  GetPatientSearchData(PagingFilter:PagingFilterModel) {
    return this.http.post<any>(`${this.apiUrl}PatientSearch/GetPatientSearchData`, PagingFilter);
  }

  GetPatientSearchFilters(FilterList:FilterModel[]) {
    return this.http.post<any>(`${this.apiUrl}PatientSearch/GetPatientSearchFilters`, FilterList);
  }
}