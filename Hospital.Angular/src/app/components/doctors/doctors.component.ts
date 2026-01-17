import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminPaginationComponent } from '../../shared/admin-pagination/admin-pagination.component';
import { AdminBreadcrumbComponent } from '../../shared/admin-breadcrumb/admin-breadcrumb.component';
import { AdminFilterComponent } from '../../shared/admin-filter/admin-filter.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminGeneralInputComponent } from '../../shared/admin-general-input/admin-general-input.component';
import { AdminDropDownComponent } from '../../shared/admin-drop-down/admin-drop-down.component';
import { PagingFilterModel } from '../../models/PagingFilterModel';
import { FilterModel } from '../../models/FilterModel';
import { DoctorService } from '../../services/doctor.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators, RegexType } from '../../services/custom-validators';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule, ReactiveFormsModule,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule,
    AdminGeneralInputComponent, AdminDropDownComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {
  DoctorsData: any[] = [];
  isFilter = true;
  BtnDisabled = false;
  DoctorId: any;
  TotalCount = 0;
  UserId: any;
  ItemForm: FormGroup;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 20
  };
  FilterList: FilterModel[] = [
    {
      categoryDisplayName: "Name",
      categoryName: "SearchText",
      filterType: "SearchText"
    }
  ];
  academicDegrees = [
    { id: 'Main Surgeon', name: 'Main Surgeon' },
    { id: 'Resident', name: 'Resident' },
    { id: 'Assistant', name: 'Assistant' },
    { id: 'Supervisor', name: 'Supervisor' }
  ];
  formErrors = {
    doctorName: '',
    academicDegree: ''
  };

  constructor(private doctorService: DoctorService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
    this.GetAllDoctorData();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      doctorId: null,
      doctorName: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
      academicDegree: ['', [Validators.required]],
      insertUser: null
    });

    this.ItemForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.patchValue({
      doctorId: item?.doctorId ?? '',
      doctorName: item?.doctorName ?? '',
      academicDegree: item.academicDegree ?? ''
    });
  }

  GetAllDoctorData(): void {
    this.doctorService.GetAllDoctorData(this.PagingFilter).subscribe(res => {
      this.DoctorsData = res.results;
      this.TotalCount = res.totalCount;
    });
  }

  OpenCreateModal(content: any, item: any) {
    this.ItemForm.reset();
    if (item)
      this.FillEditForm(item);

    this.DoctorId = item?.doctorId;
    this.modalService.open(content, {
      size: 'xl',
      windowClass: 'doctor-height-modal',
      scrollable: true,
      centered: true
    })
  }

  openDeleteItemModal(content: any, doctorId: any) {
    this.DoctorId = doctorId;
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    })
  }

  OnFilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.GetAllDoctorData();
  }

  OnPageChanged(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetAllDoctorData();
  }

  validateForm(): boolean {
    this.formService.markFormGroupTouched(this.ItemForm);
    if (this.ItemForm.valid) {
      return true;
    } else {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, false)
      return false;
    }
  }

  AddNewItem() {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return;

    this.ItemForm.patchValue({ insertUser: this.UserId });


    this.BtnDisabled = true;
    if (!this.DoctorId) {
      this.doctorService.AddNewDoctor(this.ItemForm.value).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllDoctorData();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.doctorService.UpdateDoctor(this.ItemForm.value).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllDoctorData();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }

  DeleteItem() {
    this.BtnDisabled = true;
    this.doctorService.DeleteDoctor(this.DoctorId).subscribe(res => {
      this.BtnDisabled = false;
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllDoctorData();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }
}
