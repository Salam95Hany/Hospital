import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModel } from '../../../models/FilterModel';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink, SearchAutocompleteComponent, CommonModule,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule, AdminGeneralInputComponent],
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
  AdmissionId: number;
  searchTerm: string = '';
  TotalCount = 0;

  constructor(private adminService: AdminService, private router: Router, private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {

  }

  AddNewAdmission() {
    if (!this.PatientId) {
      this.toaster.warning('Please select patient');
      return;
    }

    this.router.navigate(['/admissions/add'], { queryParams: { patientId: this.PatientId } });
  }

  GetAllAdmissionData(): void {
    this.adminService.GetAllAdmissionData(this.PatientId).subscribe(res => {
      this.Admissions = res.results;
      this.TotalCount = res.totalCount;
    });
  }

  GetAllAdmissionFilters() {
    this.adminService.GetAllAdmissionFilters(this.PatientId).subscribe(res => {
      this.FilterList = res.results;
    });
  }

  GetAdmissionByPatientId(item: any) {
    this.PatientId = item.id;
    this.GetAllAdmissionData();
    this.GetAllAdmissionFilters();
  }


  OpenAdmissionDetailsModal(content: any, admissionId: any) {
    this.AdmissionId = admissionId;
    this.modalService.open(content, {
      size: 'xl',
      scrollable: true,
      centered: true
    })
  }

  openDeleteItemModal(content: any, admissionId: any) {
    this.AdmissionId = admissionId;
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    })
  }

  OnFilterChecked(filterList: FilterModel[]) {
    console.log('filterList => ', filterList);
  }

  DeleteItem() {
    this.adminService.DeleteAdmission(this.AdmissionId).subscribe(res => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllAdmissionData();
        this.GetAllAdmissionFilters();
      } else
        this.toaster.error(res.message);
    });
  }
}
