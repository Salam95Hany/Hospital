import { Component, OnInit } from '@angular/core';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterModel } from '../../../models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../services/admin.service';
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';
import { SurgicalInterventionCreateComponent } from '../surgical-intervention-create/surgical-intervention-create.component';

@Component({
  selector: 'app-surgical-intervention-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, SearchAutocompleteComponent, CommonModule, SurgicalInterventionCreateComponent,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule, AdminGeneralInputComponent],
  templateUrl: './surgical-intervention-list.component.html',
  styleUrl: './surgical-intervention-list.component.css',
  providers: [DatePipe]
})
export class SurgicalInterventionListComponent implements OnInit {
  SurgicalInterventions: any[] = [];
  SurgicalObj: any;
  PatientId: number;
  AdmissionId: number;
  SurgicalInterventionId: number;
  searchTerm: string = '';
  isFilter = true;
  selectedPatient: any = null;
  selectedAdmission: any = null;
  TotalCount = 0;
  FilterList: FilterModel[] = [
    {
      categoryDisplayName: "Name",
      categoryName: "SearchText",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Select Date Range",
      categoryName: "DateRange",
      filterType: "DateRange"
    }
  ];

  constructor(private adminService: AdminService, private toaster: ToastrService, private modalService: NgbModal, private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  OpenSurgicalCreateModal(content: any, surgicalInterventionId: any) {
    if (!this.selectedPatient?.id) {
      this.toaster.warning('Please select patient');
      return;
    }

    if (!this.selectedAdmission?.id) {
      this.toaster.warning('Please select admission');
      return;
    }

    this.SurgicalInterventionId = surgicalInterventionId;
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    });
  }

  GetAllSurgicalIntervention(): void {
    this.adminService.GetAllSurgicalIntervention(this.AdmissionId).subscribe(response => {
      this.SurgicalInterventions = response.results;
      this.TotalCount = response.totalCount;
    });
  }

  GetSurgicalInterventionById() {
    this.adminService.GetSurgicalInterventionById(this.SurgicalInterventionId).subscribe(res => {
      if (res.results) {
        this.SurgicalObj = res.results;
        Object.keys(this.SurgicalObj).forEach(key => {
          const value = this.SurgicalObj[key];
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            this.SurgicalObj[key] = this.datePipe.transform(value, 'yyyy-MM-dd');
          }
        });
      }
    });
  }

  OpenSurgicalDetailsModal(content: any, surgicalInterventionId: any) {
    this.SurgicalInterventionId = surgicalInterventionId;
    this.GetSurgicalInterventionById();
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    })
  }

  openDeleteItemModal(content: any, surgicalInterventionId: any) {
    this.SurgicalInterventionId = surgicalInterventionId;
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
    this.GetAllSurgicalIntervention();
  }

  onPatientSelected(item: any) {
    this.PatientId = item?.id;
    this.selectedPatient = item;
    if (!item) {
      this.AdmissionId = null;
      this.selectedAdmission = null;
    }

  }

  onAdmissionSelected(item: any) {
    this.AdmissionId = item?.id;
    this.selectedAdmission = item;

    if (this.AdmissionId && this.PatientId) {
      this.GetAllSurgicalIntervention();
    }
  }

  DeleteItem() {
    this.adminService.DeleteSurgicalIntervention(this.SurgicalInterventionId).subscribe(res => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllSurgicalIntervention();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }
}
