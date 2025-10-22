import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient, PatientsList } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { FilterModel } from '../../../models/FilterModel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchAutocompleteComponent, AdminPaginationComponent, AdminFilterComponent,NgbModule],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: PatientsList[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  FilterList: FilterModel[] = [];
  isFilter = true;


  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatientsBasicInfo().subscribe(response  => {
      this.patients = response.results;
    });
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


  deletePatient(id: number): void {
      if (confirm('Are you sure you want to delete this patient and all related data?')) {
        this.patientService.deletePatientWithAllData(id).subscribe(() => {
          this.router.navigate(['/patients']);
        });
      }
    
  }
}