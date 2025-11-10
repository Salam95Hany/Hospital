import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NgClass } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { FormService } from '../../services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminGeneralInputComponent } from '../../shared/admin-general-input/admin-general-input.component';
import { CustomValidators, RegexType } from '../../services/custom-validators';

@Component({
  selector: 'app-user-profile',
  imports: [NgClass, ReactiveFormsModule, AdminGeneralInputComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  UserInfo: any;
  UserId: any;
  EditProfileForm: FormGroup;
  ChangePasswordForm: FormGroup;
  EditProfileErrors = {
    email: '',
    phoneNumber: '',
    address: ''
  };
  ChangePasswordFormErrors = {
    password: ''
  };

  constructor(private authService: AuthService, private doctorService: DoctorService, private formService: FormService, private fb: FormBuilder,
    private toaster: ToastrService, private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.GetUserInfoById();
    this.EditProfileFormInit();
    this.ChangePasswordFormInit();
  }

  EditProfileFormInit() {
    this.EditProfileForm = this.fb.group({
      userId: null,
      email: ['', [Validators.required, CustomValidators.regexPattern(RegexType.email)]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
    });

    this.EditProfileForm.valueChanges.subscribe((data) => {
      this.EditProfileErrors = this.formService.validateForm(this.EditProfileForm, this.EditProfileErrors, true);
    });
  }

  ChangePasswordFormInit() {
    this.ChangePasswordForm = this.fb.group({
      userId: null,
      password: ['', [Validators.required, CustomValidators.regexPattern(RegexType.password)]],
    });

    this.ChangePasswordForm.valueChanges.subscribe((data) => {
      this.ChangePasswordFormErrors = this.formService.validateForm(this.ChangePasswordForm, this.ChangePasswordFormErrors, true);
    });
  }

  FillEditForm() {
    this.EditProfileForm.patchValue({
      userId: this.UserInfo?.userId ?? '',
      email: this.UserInfo?.email ?? '',
      phoneNumber: this.UserInfo?.phoneNumber ?? '',
      address: this.UserInfo?.address ?? '',
    });
  }

  OpenEditProfileModal(content: any) {
    this.EditProfileForm.reset();
    this.FillEditForm();
    this.modalService.open(content, {
      size: 'lg',
      scrollable: true,
      centered: true
    })
  }

  OpenChangePasswordModal(content: any) {
    this.ChangePasswordForm.reset();
    this.modalService.open(content, {
      size: 'md',
      scrollable: true,
      centered: true
    })
  }

  GetUserInfoById() {
    this.doctorService.GetUserInfoById(this.UserId).subscribe((res) => {
      this.UserInfo = res.results;
    });
  }

  validateProfileForm(): boolean {
    this.formService.markFormGroupTouched(this.EditProfileForm);
    if (this.EditProfileForm.valid) {
      return true;
    } else {
      this.EditProfileErrors = this.formService.validateForm(this.EditProfileForm, this.EditProfileErrors, false)
      return false;
    }
  }

  EditUserProfile() {
    this.EditProfileForm = this.formService.TrimFormInputValue(this.EditProfileForm);
    let isValid = this.validateProfileForm();
    if (!isValid)
      return;

    this.EditProfileForm.patchValue({ userId: this.UserId });

    this.doctorService.EditUserProfile(this.EditProfileForm.value).subscribe((res) => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.GetUserInfoById();
        this.modalService.dismissAll();
      } else {
        this.toaster.error(res.message);
      }
    });
  }

  validatePasswordForm(): boolean {
    this.formService.markFormGroupTouched(this.ChangePasswordForm);
    if (this.ChangePasswordForm.valid) {
      return true;
    } else {
      this.ChangePasswordFormErrors = this.formService.validateForm(this.ChangePasswordForm, this.ChangePasswordFormErrors, false)
      return false;
    }
  }

  ChangeUserPassword() {
    this.ChangePasswordForm = this.formService.TrimFormInputValue(this.ChangePasswordForm);
    let isValid = this.validatePasswordForm();
    if (!isValid)
      return;

    this.ChangePasswordForm.patchValue({ userId: this.UserId });

    this.doctorService.ChangeUserPassword(this.ChangePasswordForm.value).subscribe((res) => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.modalService.dismissAll();
      } else {
        this.toaster.error(res.message);
      }
    });
  }

}
