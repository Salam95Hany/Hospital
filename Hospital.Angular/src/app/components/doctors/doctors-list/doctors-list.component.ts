import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminPaginationComponent } from "../../../shared/admin-pagination/admin-pagination.component";
import { AdminFilterComponent } from "../../../shared/admin-filter/admin-filter.component";
import { PagingFilterModel } from '../../../models/PagingFilterModel';
import { FilterModel } from '../../../models/FilterModel';
import { DoctorService } from '../../../services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { CustomValidators, RegexType } from '../../../services/custom-validators';
import { AdminDropDownComponent } from '../../../shared/admin-drop-down/admin-drop-down.component';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule, ReactiveFormsModule,
    AdminPaginationComponent, AdminBreadcrumbComponent, AdminFilterComponent, NgbModule,
    AdminGeneralInputComponent, AdminDropDownComponent],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  DoctorsData: any[] = [];
  Roles = [
    { id: 'SupperAdmin', name: 'SupperAdmin' },
    { id: 'Admin', name: 'Admin' },
    { id: 'ReadOnly', name: 'ReadOnly' },
    { id: 'FollowUpOnly', name: 'FollowUpOnly' },
  ];
  isFilter = true;
  BtnDisabled = false;
  UserId: any;
  TotalCount = 0;
  CurrentUserId: any;
  ItemForm: FormGroup;
  PagingFilter: PagingFilterModel = {
    filterList: [],
    currentpage: 1,
    pagesize: 10
  };
  FilterList: FilterModel[] = [
    {
      categoryDisplayName: "Name",
      categoryName: "SearchText",
      filterType: "SearchText"
    },
    {
      categoryDisplayName: "Login Date",
      categoryName: "Login Date",
      filterType: "DateRange"
    }
  ];
  formErrors = {
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    role: ''
  };

  constructor(private doctorService: DoctorService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.CurrentUserId = this.authService.userId;
    this.FormInit();
    this.GetAllDoctorsData();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      userId: null,
      userName: ['', [Validators.required, CustomValidators.regexPattern(RegexType.englishLettersOnly), CustomValidators.regexPattern(RegexType.noSpace)]],
      email: ['', [Validators.required, CustomValidators.regexPattern(RegexType.email)]],
      password: ['', [Validators.required, CustomValidators.regexPattern(RegexType.password)]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
      role: ['', [Validators.required]],
    });

    this.ItemForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.patchValue({
      userId: item?.userId ?? '',
      userName: item?.userName ?? '',
      email: item.email ?? '',
      phoneNumber: item.phoneNumber ?? '',
      address: item.address ?? '',
      role: item.role ?? ''
    });
  }

  GetAllDoctorsData(): void {
    this.doctorService.GetAllUsers().subscribe(res => {
      this.DoctorsData = res.results;
      this.TotalCount = res.totalCount;
    });
  }

  OpenCreateModal(content: any, item: any) {
    this.formService.updateFieldsRequiredValidation(this.ItemForm, 'password', true);
    this.ItemForm.reset();
    if (item) {
      this.FillEditForm(item);
      this.formService.updateFieldsRequiredValidation(this.ItemForm, 'password', false);
    }
    this.UserId = item?.userId;
    this.modalService.open(content, {
      windowClass: 'details-size-modal',
      scrollable: true,
      centered: true
    })
  }

  openDeleteItemModal(content: any, userId: any) {
    this.UserId = userId;
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    })
  }

  OnFilterChecked(filterList: FilterModel[]) {
    this.PagingFilter.filterList = filterList;
    this.GetAllDoctorsData();
  }

  OnPageChanged(obj: any) {
    this.PagingFilter.currentpage = obj.page;
    this.GetAllDoctorsData();
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

    this.ItemForm.patchValue({ insertUser: this.CurrentUserId });


    this.BtnDisabled = true;
    if (!this.UserId) {
      this.doctorService.CreateUser(this.ItemForm.value).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllDoctorsData();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.doctorService.EditUser(this.ItemForm.value).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.GetAllDoctorsData();
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }

  DeleteItem() {
    this.BtnDisabled = true;
    this.doctorService.DeleteUser(this.UserId).subscribe(res => {
      this.BtnDisabled = false;
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetAllDoctorsData();
        this.modalService.dismissAll();
      } else
        this.toaster.error(res.message);
    });
  }
}
