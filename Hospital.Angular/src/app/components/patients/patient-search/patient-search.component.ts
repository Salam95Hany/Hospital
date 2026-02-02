import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
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
import { SearchReportModel } from '../../../models/SearchReportModel';
import { DownloadFileService } from '../../../services/download-file.service';
import { NgxLoadingModule } from "ngx-loading";

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, NgbModule, AdminFilterComponent, NgFor, NgIf, NgxLoadingModule],
  templateUrl: './patient-search.component.html',
  styleUrl: './patient-search.component.css',
  providers: [DatePipe]
})
export class PatientSearchComponent implements OnInit {
  Patients: any[] = [];
  FilterList: FilterModel[] = [];
  isFilter = true;
  showLoader = false;
  TotalCount = 0;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 20
  };
  ReportModel: SearchReportModel = {
    reportType: '',
    queryString: [],
    filterList: []
  };

  constructor(private patientService: PatientService, private toastr: ToastrService, private authService: AuthService, private fileService: DownloadFileService,
    private datePipe: DatePipe
  ) { }

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
    this.ReportModel.filterList = filterList;
    this.PagingFilter.currentpage = 1;
    this.GetPatientSearchData();
    this.GetPatientSearchFilters();
  }

  OnPageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetPatientSearchData();
  }

  DownloadExcelFile() {
    if (this.Patients.length == 0) {
      this.toastr.warning('No data to export');
      return;
    }

    this.ReportModel.userName = this.authService.userName;
    this.ReportModel.reportType = 'PatientSearchExcel';
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let fileName = 'Patient Search' + '_' + today;
    this.showLoader = true;
    this.fileService.DownloadFile(this.ReportModel, fileName + '.xlsx').subscribe(data => {
      this.showLoader = false;
    });
  }

}
