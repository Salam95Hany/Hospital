import { Component } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModel } from '../../../models/FilterModel';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, SearchAutocompleteComponent,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule],
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.css',
  providers: [DatePipe]
})
export class AdmissionListComponent {
  TitleList = ["Home", "Admission"]
  Admissions: any[] = [];
  FilterList: FilterModel[] = [];
  isFilter = true;
  PatientId: number;
  searchTerm: string = '';

  constructor(private patientService: PatientService, private router: Router, private datePipe: DatePipe) { }

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
