import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctors: Doctor[] = [
    { id: 1, fullName: 'د. محمود حسنى', specialization: 'باطنة', department: 'الداخلية', phoneNumber: '01011112222', licenseNumber: 'D-1001', createdAt: new Date('2023-01-05') },
    { id: 2, fullName: 'د. ليلى أحمد', specialization: 'جراحة', department: 'الجراحة', phoneNumber: '01033334444', licenseNumber: 'D-1002', createdAt: new Date('2023-02-12') }
  ];

  constructor() { }

  getDoctors(): Observable<Doctor[]> { return of(this.doctors); }

  getDoctorById(id: number): Observable<Doctor | undefined> {
    const d = this.doctors.find(x => x.id === id);
    return of(d);
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    const newId = Math.max(...this.doctors.map(d => d.id || 0)) + 1;
    const newDoctor: Doctor = { ...doctor, id: newId, createdAt: new Date(), updatedAt: new Date() };
    this.doctors.push(newDoctor);
    return of(newDoctor);
  }

  updateDoctor(doctor: Doctor): Observable<Doctor> {
    const idx = this.doctors.findIndex(d => d.id === doctor.id);
    if (idx !== -1) {
      this.doctors[idx] = { ...doctor, updatedAt: new Date() };
      return of(this.doctors[idx]);
    }
    return of(doctor);
  }

  deleteDoctor(id: number): Observable<boolean> {
    const initial = this.doctors.length;
    this.doctors = this.doctors.filter(d => d.id !== id);
    return of(this.doctors.length !== initial);
  }
}
