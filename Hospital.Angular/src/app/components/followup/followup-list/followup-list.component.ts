import { Component } from '@angular/core';
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { FollowupCreateComponent } from "../followup-create/followup-create.component";
import { FormBuilder, FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';
import { AdminService } from '../../../services/admin.service';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from '../../../models/FilterModel';

@Component({
  selector: 'app-followup-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, SearchAutocompleteComponent, CommonModule,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule, AdminGeneralInputComponent, FollowupCreateComponent],
  templateUrl: './followup-list.component.html',
  styleUrl: './followup-list.component.css',
  providers: [DatePipe]
})
export class FollowupListComponent {
  FollowUps: any[] = [];
  FollowUpObj: any;
  SurgicalInterventionId: number;
  FollowUpId: number;
  searchTerm: string = '';
  selectedPatient: any = null;
  selectedAdmission: any = null;
  selectedSurgicalInterventions: any = null;
  isFilter = true;
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

  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  GetAllFollowUpData(): void {
    this.adminService.GetAllFollowUpData(this.SurgicalInterventionId).subscribe(response => {
      this.FollowUps = response.results;
      this.TotalCount = response.totalCount;
    });
  }

  GetFollowUpById() {
    this.adminService.GetFollowUpById(this.FollowUpId).subscribe(res => {
      if (res.results) {
        this.FollowUpObj = res.results;
        Object.keys(this.FollowUpObj).forEach(key => {
          const value = this.FollowUpObj[key];
          if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            this.FollowUpObj[key] = this.datePipe.transform(value, 'yyyy-MM-dd');
          }
        });
      }
    });
  }

  onPatientSelected(item: any) {
    this.selectedPatient = item;
    if (!item) {
      this.selectedAdmission = null;
      this.SurgicalInterventionId = null;
      this.selectedSurgicalInterventions = null;
    }
  }

  onAdmissionSelected(item: any) {
    this.selectedAdmission = item;
    if (!item) {
      this.SurgicalInterventionId = null;
      this.selectedSurgicalInterventions = null;
    }
  }

  onSurgicalInterventionsSelected(item: any) {
    this.SurgicalInterventionId = item?.id;
    this.selectedSurgicalInterventions = item;
    this.GetAllFollowUpData();
  }

  OpenFollowUpCreateModal(content: any, followUpId: any) {
    if (!this.selectedPatient?.id) {
      this.toaster.warning('Please select patient');
      return;
    }

    if (!this.selectedAdmission?.id) {
      this.toaster.warning('Please select admission');
      return;
    }

    if (!this.selectedSurgicalInterventions?.id) {
      this.toaster.warning('Please select surgical intervention');
      return;
    }

    this.FollowUpId = followUpId;
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    });
  }

  OpenFollowUpDetailsModal(content: any, followUpId: any) {
    this.FollowUpId = followUpId;
    this.GetFollowUpById();
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    })
  }

  openDeleteItemModal(content: any, followUpId: any) {
    this.FollowUpId = followUpId;
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
    this.GetAllFollowUpData();
  }

  DeleteItem() {
    this.adminService.DeleteFollowUp(this.FollowUpId).subscribe(res => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllFollowUpData();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }
}
