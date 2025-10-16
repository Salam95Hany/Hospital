import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientData, PatientsList } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:40950/api/Patients'; // Adjust the URL as needed
  private patients: PatientData[] = [];

  constructor(private http: HttpClient) { }

  // New method to add a full patient record
  AddNewPatientFull(patientData: PatientData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddNewPatientFull`, patientData);
  }

  // New method to get basic patient info
  getAllPatientsBasicInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllPatientsBasicInfo`);
  }

  getPatients(): Observable<PatientData[]> {
    return of(this.patients);
  }

  getPatientById(id: number): Observable<PatientData | undefined> {
    const patient = this.patients.find(p => p.patient);
    return of(patient);
  }
  updatePatientFull(patientData: PatientData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdatePatientFull`, patientData);
  }

  deletePatientWithAllData(patientId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeletePatientWithAllData/${patientId}`);
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
}