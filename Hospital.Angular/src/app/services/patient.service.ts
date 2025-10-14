import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PatientData } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: PatientData[] = [];

  constructor() { }

  getPatients(): Observable<PatientData[]> {
    return of(this.patients);
  }

  getPatientById(id: number): Observable<PatientData | undefined> {
    const patient = this.patients.find(p => p.patient);
    return of(patient);
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