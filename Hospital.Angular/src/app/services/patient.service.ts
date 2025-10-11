import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [
    {
      id: 1,
      fileNumber: 'P001',
      fullName: 'أحمد محمد',
      gender: 'male',
      birthDate: new Date('1985-05-15'),
      phoneNumber: '0123456789',
      email: 'ahmed@example.com',
      address: 'القاهرة، مصر',
      nationalId: '12345678901234',
      bloodType: 'O+',
      createdAt: new Date('2023-01-15')
    },
    {
      id: 2,
      fileNumber: 'P002',
      fullName: 'فاطمة علي',
      gender: 'female',
      birthDate: new Date('1990-08-20'),
      phoneNumber: '0198765432',
      email: 'fatima@example.com',
      address: 'الإسكندرية، مصر',
      nationalId: '98765432109876',
      bloodType: 'A+',
      createdAt: new Date('2023-02-10')
    },
    {
      id: 3,
      fileNumber: 'P003',
      fullName: 'محمود خالد',
      gender: 'male',
      birthDate: new Date('1978-11-03'),
      phoneNumber: '0112233445',
      email: 'mahmoud@example.com',
      address: 'الجيزة، مصر',
      nationalId: '45678901234567',
      bloodType: 'B-',
      createdAt: new Date('2023-03-05')
    }
  ];

  constructor() { }

  getPatients(): Observable<Patient[]> {
    return of(this.patients);
  }

  getPatientById(id: number): Observable<Patient | undefined> {
    const patient = this.patients.find(p => p.id === id);
    return of(patient);
  }

  addPatient(patient: Patient): Observable<Patient> {
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = Math.max(...this.patients.map(p => p.id || 0)) + 1;
    
    const newPatient: Patient = {
      ...patient,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.patients.push(newPatient);
    return of(newPatient);
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const index = this.patients.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      this.patients[index] = {
        ...patient,
        updatedAt: new Date()
      };
      return of(this.patients[index]);
    }
    return of(patient); // Return original if not found
  }

  deletePatient(id: number): Observable<boolean> {
    const initialLength = this.patients.length;
    this.patients = this.patients.filter(p => p.id !== id);
    return of(this.patients.length !== initialLength);
  }
}