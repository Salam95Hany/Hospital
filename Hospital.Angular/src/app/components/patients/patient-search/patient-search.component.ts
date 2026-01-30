import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminPaginationComponent } from '../../../shared/admin-pagination/admin-pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminFilterComponent } from '../../../shared/admin-filter/admin-filter.component';
import { PagingFilterModel } from '../../../models/PagingFilterModel';
import { FilterModel } from '../../../models/FilterModel';
import { PatientService } from '../../../services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, NgbModule, AdminFilterComponent, NgFor, NgIf],
  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.css'
})
export class PatientSearchComponent implements OnInit {
  Patients: any[] = [];
  FilterList: FilterModel[] = [];
  isFilter = true;
  TotalCount = 0;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 20
  };

  constructor(private patientService: PatientService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.GetPatientSearchData();
    this.GetPatientSearchFilters();
  }

  GetPatientSearchData(): void {
    this.patientService.GetPatientSearchData(this.PagingFilter).subscribe(response => {
      this.Patients = response.results;
      this.TotalCount = response.totalCount;
    });
  }

  GetPatientSearchFilters(): void {
    this.patientService.GetPatientSearchFilters(this.PagingFilter.filterList).subscribe(response => {
      this.FilterList = response.results;
    });
  }

  OnFilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.PagingFilter.currentpage = 1;
    this.GetPatientSearchData();
    this.GetPatientSearchFilters();
  }

  OnPageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetPatientSearchData();
  }

  DownloadExcelFile() {
  }

}
