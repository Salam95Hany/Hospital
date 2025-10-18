import { Component, OnInit } from '@angular/core';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { PatientService } from '../../../services/patient.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-surgical-intervention-list',
  imports: [SearchAutocompleteComponent,RouterLink,NgFor,NgIf],
  templateUrl: './surgical-intervention-list.component.html',
  styleUrl: './surgical-intervention-list.component.css'
})
export class SurgicalInterventionListComponent implements OnInit {
  Admissions: any[] = [];
  PatientId: number;
  searchTerm: string = '';

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatientsBasicInfo().subscribe(response => {
      this.Admissions = response.results;
    });
  }

  viewItem(id: number | undefined): void {

  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this patient and all related data?')) {
      this.patientService.deletePatientWithAllData(id).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    }
  }
}
