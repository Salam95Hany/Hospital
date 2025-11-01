import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
import { AdmissionCreateComponent } from "../admission-create/admission-create.component";
import { ActionTypes, FilesModel } from '../../../models/UploadFileModel';
import { AdminSliderImageComponent } from '../../../shared/admin-slider-image/admin-slider-image.component';

@Component({
  selector: 'app-admission-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, SearchAutocompleteComponent, CommonModule,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule,
    AdminGeneralInputComponent, AdmissionCreateComponent, AdminSliderImageComponent],
  templateUrl: './admission-list.component.html',
  styleUrl: './admission-list.component.css',
  providers: [DatePipe]
})
export class AdmissionListComponent {
  TitleList = ["Home", "Admission"]
  Admissions: any[] = [];
  FilterList: FilterModel[] = [];
  ImportedFiles: FilesModel[] = [];
  AdmissionObj: any;
  isFilter = true;
  PatientId: number;
  AdmissionId: number;
  searchTerm: string = '';
  TotalCount = 0;

  constructor(private adminService: AdminService, private router: Router, private toaster: ToastrService, private modalService: NgbModal, private datePipe: DatePipe) { }

  ngOnInit(): void {

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

  GetAdmissionById() {
    this.adminService.GetAdmissionById(this.AdmissionId).subscribe(res => {
      if (res.results) {
        this.AdmissionObj = res.results;
        Object.keys(this.AdmissionObj).forEach(key => {
          const value = this.AdmissionObj[key];
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            this.AdmissionObj[key] = this.datePipe.transform(value, 'yyyy-MM-dd');
          }
        });
      }
    });
  }

  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.AdmissionId, ActionTypes.Admission).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.Admission,
            fileName: i.fileName,
            existFileName: i.existFileName,
            fileUrl: i.fileUrl,
            fileSize: i.fileSize,
            file: null
          }
        });
      }
    })
  }

  OpenAdmissionCreateModal(content: any, admissionId: any) {
    if (!this.PatientId) {
      this.toaster.warning('Please select patient');
      return;
    }

    this.AdmissionId = admissionId;
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    })
  }

  OpenAdmissionDetailsModal(content: any, admissionId: any) {
    this.AdmissionId = admissionId;
    this.GetAdmissionById();
    this.GetFilesByActionId();
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
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

  RefreshData(item: boolean) {
    this.GetAllAdmissionData();
    this.GetAllAdmissionFilters();
  }

  DeleteItem() {
    this.adminService.DeleteAdmission(this.AdmissionId).subscribe(res => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllAdmissionData();
        this.GetAllAdmissionFilters();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }
}
