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
import { SurgicalInterventionCreateComponent } from '../surgical-intervention-create/surgical-intervention-create.component';
import { PagingFilterModel } from '../../../models/PagingFilterModel';
import { ActionTypes, FilesModel } from '../../../models/UploadFileModel';
import { RoleCheckerDirective } from '../../../directives/role-checker.directive';
import { DoctorService } from '../../../services/doctor.service';
import { DownloadFileService } from '../../../services/download-file.service';
import { SearchReportModel } from '../../../models/SearchReportModel';
import { NgxLoadingModule } from 'ngx-loading';
import { EditExpireDirective } from '../../../directives/edit-expire.directive';

@Component({
  selector: 'app-surgical-intervention-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, SearchAutocompleteComponent, CommonModule, SurgicalInterventionCreateComponent, EditExpireDirective,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule, RoleCheckerDirective, NgxLoadingModule],
  templateUrl: './surgical-intervention-list.component.html',
  styleUrl: './surgical-intervention-list.component.css',
  providers: [DatePipe]
})
export class SurgicalInterventionListComponent implements OnInit {
  SurgicalInterventions: any[] = [];
  ImportedFiles: FilesModel[] = [];
  DoctorsData: { id: string, name: string, academicDegree: string }[] = [];
  SelectedDoctors: { id: number, name: string }[] = [];
  SelectedMainSurgeon: { id: number, name: string }[] = [];
  SelectedAssistants: { id: number, name: string }[] = [];
  SelectedResident: { id: number, name: string }[] = [];
  SelectedSupervisor: { id: number, name: string }[] = [];
  mainSurgeonNames: string = '';
  assistantsNames: string = '';
  residentNames: string = '';
  supervisorNames: string = '';
  SurgicalObj: any;
  PatientId: number;
  AdmissionId: number;
  SurgicalInterventionId: number;
  searchTerm: string = '';
  isFilter = true;
  showSlider = false;
  showLoader = false;
  selectedPatient: any = null;
  selectedAdmission: any = null;
  TotalCount = 0;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 10
  };
  DoctorPagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 1000
  };
  FilterList: FilterModel[] = [];
  ReportModel: SearchReportModel = {
    reportType: '',
    queryString: []
  };

  constructor(private adminService: AdminService, private toaster: ToastrService, private modalService: NgbModal, private datePipe: DatePipe,
    private doctorService: DoctorService, private fileService: DownloadFileService
  ) { }

  ngOnInit(): void {
    this.GetAllDoctorData();
  }

  GetAllDoctorData(): void {
    this.doctorService.GetAllDoctorData(this.DoctorPagingFilter).subscribe(res => {
      this.DoctorsData = res.results.map(i => { return { id: i.doctorId?.toString(), name: i.doctorName, academicDegree: (i.academicDegree || '').toString() } });
    });
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
    this.adminService.GetAllSurgicalIntervention(this.PagingFilter, this.AdmissionId).subscribe(response => {
      this.SurgicalInterventions = response.results;
      this.TotalCount = response.totalCount;
    });
  }

  GetAllSurgicalInterventionFilters() {
    this.adminService.GetAllSurgicalInterventionFilters(this.AdmissionId).subscribe(response => {
      this.FilterList = response.results;
      console.log(this.FilterList);

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

        this.SelectedDoctors = [];
        this.SelectedMainSurgeon = [];
        this.SelectedAssistants = [];
        this.SelectedResident = [];
        this.SelectedSupervisor = [];
        const mapCsv = (csv: string | null | undefined): { id: number, name: string }[] => {
          const raw = (csv ?? '').toString();
          if (!raw.trim()) return [];
          const ids = raw.split(',').map(s => s.trim()).filter(Boolean);
          return ids.map(idStr => {
            const doc = this.DoctorsData.find(d => d.id == idStr);
            const id = Number(idStr);
            return { id, name: doc?.name ?? '' };
          }).filter(d => !!d.id);
        };
        const extract = (arr: any[] | undefined): { id: number, name: string }[] => {
          const list = Array.isArray(arr) ? arr : [];
          return list
            .map(d => ({ id: Number(d?.doctorId ?? d?.DoctorId ?? 0), name: (d?.doctorName ?? d?.DoctorName ?? '').toString() }))
            .filter(d => !!d.id && !!d.name);
        };
        const ms = extract(this.SurgicalObj?.mainSurgeonDetails ?? this.SurgicalObj?.MainSurgeonDetails);
        const asst = extract(this.SurgicalObj?.assistantsDetails ?? this.SurgicalObj?.AssistantsDetails);
        const resi = extract(this.SurgicalObj?.residentDetails ?? this.SurgicalObj?.ResidentDetails);
        const sup = extract(this.SurgicalObj?.offFieldSupervisorDetails ?? this.SurgicalObj?.OffFieldSupervisorDetails);
        this.SelectedMainSurgeon = ms.length ? ms : mapCsv(this.SurgicalObj?.mainSurgeon);
        this.SelectedAssistants = asst.length ? asst : mapCsv(this.SurgicalObj?.assistants);
        this.SelectedResident = resi.length ? resi : mapCsv(this.SurgicalObj?.resident);
        this.SelectedSupervisor = sup.length ? sup : mapCsv(this.SurgicalObj?.offFieldSupervisor);
        this.mainSurgeonNames = this.SelectedMainSurgeon.map(s => s.name).join(', ');
        this.assistantsNames = this.SelectedAssistants.map(s => s.name).join(', ');
        this.residentNames = this.SelectedResident.map(s => s.name).join(', ');
        this.supervisorNames = this.SelectedSupervisor.map(s => s.name).join(', ');
        const unionIds = new Set<number>();
        [...this.SelectedMainSurgeon, ...this.SelectedAssistants, ...this.SelectedResident, ...this.SelectedSupervisor].forEach(d => unionIds.add(d.id));
        this.SelectedDoctors = Array.from(unionIds).map(id => {
          const doc = this.DoctorsData.find(d => +d.id === id);
          return { id, name: doc?.name ?? '' };
        });
      }
    });
  }

  GetFilesByActionId() {
    this.showSlider = false;
    this.adminService.GetFilesByActionId(this.SurgicalInterventionId, ActionTypes.SurgicalIntervention).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.SurgicalIntervention,
            fileName: i.fileName,
            existFileName: i.existFileName,
            fileUrl: i.fileUrl,
            fileSize: i.fileSize,
            mediaType: i.mediaType,
            file: null
          }
        });

        this.showSlider = true;
      }
    })
  }

  OpenSurgicalDetailsModal(content: any, surgicalInterventionId: any) {
    this.SurgicalInterventionId = surgicalInterventionId;
    this.GetSurgicalInterventionById();
    this.GetFilesByActionId();
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
    this.PagingFilter.filterList = filterList;
    this.GetAllSurgicalIntervention();
  }

  OnPageChanged(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetAllSurgicalIntervention();
  }

  RefreshData(item: boolean) {
    this.GetAllSurgicalIntervention();
    this.GetAllSurgicalInterventionFilters();
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
      this.GetAllSurgicalInterventionFilters();
    }
  }

  DeleteItem() {
    this.showLoader = true;
    this.adminService.DeleteSurgicalIntervention(this.SurgicalInterventionId).subscribe(res => {
      this.showLoader = false;
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllSurgicalIntervention();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }

  DownloadPdfFile(surgicalId: any, reportType: string) {
    this.ReportModel.queryString = [
      { key: 'PatientId', value: this.PatientId.toString() },
      { key: 'AdmissionId', value: this.AdmissionId.toString() },
      { key: 'SurgicalId', value: surgicalId.toString() }
    ];
    this.ReportModel.reportType = reportType;
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd-HHmmss');
    let fileName = reportType + '_' + today;
    this.showLoader = true;
    this.fileService.DownloadFile(this.ReportModel, fileName + '.pdf').subscribe(data => {
      this.showLoader = false;
    });
  }
}
