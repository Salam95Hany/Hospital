import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.patients;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient => 
      patient.fullName.toLowerCase().includes(searchTermLower) ||
      patient.fileNumber?.toLowerCase().includes(searchTermLower) ||
      patient.phoneNumber.toLowerCase().includes(searchTermLower)
    );
  }

  navigateToAddPatient(): void {
    this.router.navigate(['/patients/add']);
  }

  viewPatient(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/patients/view', id]);
    }
  }

  editPatient(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/patients/edit', id]);
    }
  }

  deletePatient(id: number | undefined): void {
    if (id && confirm('هل أنت متأكد من حذف هذا المريض؟')) {
      this.patientService.deletePatient(id).subscribe(success => {
        if (success) {
          this.loadPatients();
        }
      });
    }
  }
}