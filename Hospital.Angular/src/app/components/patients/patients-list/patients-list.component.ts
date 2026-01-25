import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientsList } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient.service';
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { FilterModel } from '../../../models/FilterModel';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PagingFilterModel } from '../../../models/PagingFilterModel';
import { PaitentDataComponent } from '../../paitent-data/paitent-data.component';
import { PatientLastDetailsComponent } from '../../patient-last-details/patient-last-details.component';
import { PatientCreateComponent } from '../patient-create/patient-create.component';
import { AdminFilterComponent } from '../../../shared/admin-filter/admin-filter.component';
import { RoleCheckerDirective } from '../../../directives/role-checker.directive';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, NgbModule, PaitentDataComponent, AdminFilterComponent, PatientCreateComponent,
    RoleCheckerDirective
  ],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: PatientsList[] = [];
  filteredPatients: PatientsList[] = [];
  isFilter = false;
  BtnDisabled = false;
  TotalCount = 0;
  CurrentPage = 1;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 20
  };
  FilterList: FilterModel[] = [
    // {
    //   categoryDisplayName: "Code",
    //   categoryName: "SearchText",
    //   filterType: "SearchText"
    // },
    {
      categoryDisplayName: "Address",
      categoryName: "Address Text",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Name",
      categoryName: "Name",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Age",
      categoryName: "Age",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Gender",
      categoryName: "Gender",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "National ID",
      categoryName: "National ID",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Phone 1",
      categoryName: "Phone 1",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Phone 2",
      categoryName: "Phone 2",
      filterType: "SearchText"
    }
  ];

  PatientId: any;
  @ViewChild('PatientCreateModal', { read: TemplateRef }) PatientCreateModalRef!: TemplateRef<any>;
  @ViewChild('PatientCreateFullModal', { read: TemplateRef }) PatientCreateFullModalRef!: TemplateRef<any>;

  // Side info panel state
  isInfoOpen = false;
  selectedPatientId: number | null = null;
  canManage = false;


  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPatients();
    this.canManage = this.authService.isInRole(['SupperAdmin', 'Admin']);
    //this.GetAllPatientsBasicInfoFilter();
  }

  loadPatients(): void {
    this.patientService.getAllPatientsBasicInfo(this.PagingFilter).subscribe(response => {
      this.patients = response.results;
      this.TotalCount = response.totalCount;
      this.filteredPatients = this.patients;
    });
  }

  getEmptyColspan(): number {
    // 8 columns when Actions are visible; 7 when hidden
    return this.canManage ? 8 : 7;
  }

  // GetAllPatientsBasicInfoFilter() {
  //   this.patientService.GetAllPatientsBasicInfoFilter(this.PagingFilter).subscribe(data => {
  //     // Fallback filters if backend returns empty
  //     this.FilterList = (data && data.length > 0) ? data : [
  //       {
  //         categoryDisplayName: "Name",
  //         categoryName: "SearchText",
  //         filterType: "SearchText"
  //       },
  //       {
  //         categoryDisplayName: "Birth Date",
  //         categoryName: "BirthDate",
  //         filterType: "DateRange"
  //       }
  //     ];
  //   });
  // }

  OnFilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.loadPatients();
  }

  OnPageChange(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.loadPatients();
  }


  navigateToAddPatient(): void {
    // Open the full create workflow in a large modal instead of routing
    this.OpenPatientCreateFullModal(this.PatientCreateFullModalRef);
  }

  viewPatient(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/admin/patients/view', id]);
    }
  }

  editPatient(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/admin/patients/edit', id]);
    }
  }

  openPatientInfo(id: number | undefined): void {
    if (id) {
      this.selectedPatientId = id;
      this.isInfoOpen = true;
    }
  }

  closePatientInfo(): void {
    this.isInfoOpen = false;
    this.selectedPatientId = null;
  }


  deletePatient(id: number): void {
    if (confirm('Are you sure you want to delete this patient and all related data?')) {
      this.patientService.deletePatientWithAllData(id).subscribe({
        next: () => {
          this.toastr.success('Patient deleted successfully!', 'Success');
          this.loadPatients();
          //this.GetAllPatientsBasicInfoFilter();
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.toastr.error('Failed to delete patient', 'Error');
        }
      });
    }

  }

  OpenPatentCreateModal(content: any, patientId: any) {
    this.PatientId = patientId;
    try {
      const tpl = content || this.PatientCreateModalRef;
      this.modalService.open(tpl, {
        windowClass: 'details-size-modal',
        scrollable: true,
        centered: true
      });
    } catch (err) {
      console.error('Failed to open patient modal:', err);
      // fallback: try opening the ViewChild template if available
      if (this.PatientCreateModalRef) {
        try {
          this.modalService.open(this.PatientCreateModalRef, {
            windowClass: 'details-size-modal',
            scrollable: true,
            centered: true
          });
        } catch (innerErr) {
          console.error('Fallback modal open failed:', innerErr);
        }
      }
    }
  }

  OpenPatientCreateFullModal(content?: any) {
    const tpl = content || this.PatientCreateFullModalRef;
    if (!tpl) {
      console.error('PatientCreateFullModal template not found');
      return;
    }
    this.modalService.open(tpl, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    });
  }
  RefreshData(item: boolean) {
  this.loadPatients();
  }

}
