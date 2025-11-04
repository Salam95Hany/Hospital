import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionTypes, FilesModel, UploadFileModel } from '../../models/UploadFileModel';
import { PatientService } from '../../services/patient.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';
import { PatientData, Admission, SurgicalIntervention, FollowUp } from '../../models/patient.model';
import { CommonModule } from '@angular/common';
import { AdminGeneralInputComponent } from '../../shared/admin-general-input/admin-general-input.component';
import { AdminDropDownComponent } from '../../shared/admin-drop-down/admin-drop-down.component';
import { AdminSliderImageComponent } from '../../shared/admin-slider-image/admin-slider-image.component';
import { AdminUploadFileComponent } from '../../shared/admin-upload-file/admin-upload-file.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paitent-data',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    AdminGeneralInputComponent,
    AdminDropDownComponent,AdminSliderImageComponent, AdminUploadFileComponent],
  templateUrl: './paitent-data.component.html',
  styleUrls: ['./paitent-data.component.css']
})
export class PaitentDataComponent implements OnInit {
patientData: PatientData = new PatientData();
  patientForm: FormGroup;
  currentStep: number = 1;
  SelectedFile: UploadFileModel;
  ImportedFiles: FilesModel[] = [];
  @Input() PatientId: any;
  @Output() RefreshData = new EventEmitter<boolean>();
  
  governorates = [
    { id: 1, name: 'Cairo' }, { id: 2, name: 'Giza' }, { id: 3, name: 'Alexandria' }, { id: 4, name: 'Dakahlia' }, { id: 5, name: 'Red Sea' }, { id: 6, name: 'Beheira' }, { id: 7, name: 'Fayoum' },
    { id: 8, name: 'Gharbia' }, { id: 9, name: 'Ismailia' }, { id: 10, name: 'Menofia' }, { id: 11, name: 'Minya' }, { id: 12, name: 'Qalyubia' }, { id: 13, name: 'New Valley' }, { id: 14, name: 'Suez' },
    { id: 15, name: 'Aswan' }, { id: 16, name: 'Assiut' }, { id: 17, name: 'Beni Suef' }, { id: 18, name: 'Port Said' }, { id: 19, name: 'Damietta' }, { id: 20, name: 'Sharkia' }, { id: 21, name: 'Sohag' },
    { id: 22, name: 'Kafr El Sheikh' }, { id: 23, name: 'Luxor' }, { id: 24, name: 'Qena' }, { id: 25, name: 'North Sinai' }, { id: 26, name: 'South Sinai' }, { id: 27, name: 'Matrouh' }
  ];
  maritalStatuses = [
    { id: 1, name: 'Single' }, { id: 2, name: 'Married' }, { id: 3, name: 'Divorced' }, { id: 4, name: 'Widowed' }, { id: 5, name: 'Child' }
  ];
  isEditMode: boolean = false;

  
  formErrors = {
    nationalId: '',
    name: '',
  };
  form: FormGroup<any>;
  patientDataOnly: import("d:/mine/Hospital/Hospital.Angular/src/app/models/patient.model").Patient;
  // full payload returned from getPatientById (contains patient, admissions, surgical, followUp)
  loadedPatientFull: any = null;
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private formService: FormService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupFormValueChanges();
    this.getPatientDataById();
    this.GetFilesByActionId();
  }

  initForm() {
    this.patientForm = this.fb.group({
      patient: this.fb.group({
        name: ['', Validators.required],
        birthDate: [null],
        age: [null],
        gender: [''],
        nationalId: ['', [Validators.required]],
        address: [''],
        governorate: [''],
        occupation: [''],
        maritalStatus: [''],
        childrenCount: [''],
        internalNumber: ['']
      }),
    });
  }
  OnFileChange(selectedFile: UploadFileModel) {
    this.SelectedFile = selectedFile;
  }
  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.PatientId, ActionTypes.Patient).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.Patient,
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

  RefreshImageData(item: boolean) {
    this.GetFilesByActionId();
  }

  setupFormValueChanges() {
    // Subscribe to form value changes to clear errors when fields are filled
    this.patientForm.valueChanges.subscribe(() => {
      this.clearErrorsOnValidInput();
    });

    // Also subscribe to individual form group changes for better performance
    this.patientForm.get('patient').valueChanges.subscribe(() => {
      this.clearErrorsForFormGroup(this.patientForm.get('patient') as FormGroup);
    });
}
get patient(): FormGroup {
    return this.patientForm.get('patient') as FormGroup;
  }
  validateCurrentStep(): boolean {
    const currentFormGroup = this.getCurrentStepFormGroup();
    if (!currentFormGroup) return false;
    
    this.markFormGroupTouched(currentFormGroup);
    return currentFormGroup.valid;
  }

  getCurrentStepFormGroup(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.patientForm.get('patient') as FormGroup;
      default:
        return null;
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    if (formGroup instanceof FormArray) {
      formGroup.controls.forEach(control => {
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    } else {
      Object.values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
  }

  showValidationErrors() {
    const currentFormGroup = this.getCurrentStepFormGroup();
    if (!currentFormGroup) return;

    Object.keys(currentFormGroup.controls).forEach(key => {
      const control = currentFormGroup.get(key);
      if (control && control.errors && control.touched) {
        this.formErrors[key] = this.getErrorMessage(control.errors);
      } else {
        delete this.formErrors[key];
      }
    });
  }

  getErrorMessage(errors: any): string {
    if (errors.required) {
      return 'This field is required';
    }
    return '';
  }

  clearErrorsOnValidInput() {
    // Clear errors for the entire form when inputs become valid
    const formGroups = [
      this.patientForm.get('patient') as FormGroup,
    ];

    formGroups.forEach(formGroup => {
      this.clearErrorsForFormGroup(formGroup);
    });
  }

  clearErrorsForFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.valid && this.formErrors[key]) {
        delete this.formErrors[key];
      }
    });
  }
  updatePatient(): void {
    this.patientForm = this.formService.TrimFormInputValue(this.patientForm);
    
    this.markFormGroupTouched(this.patientForm.get('patient') as FormGroup);

    const patientValid = (this.patientForm.get('patient') as FormGroup).valid;

    if (this.PatientId)
      this.patientForm.patchValue({ patientId: this.PatientId });

    
    if (!patientValid) {
        this.showValidationErrors();
        return;
    }

    const patientGroup = this.patientForm.get('patient') as FormGroup;
      if (this.PatientId) {
        const original = this.loadedPatientFull || {};
        const clone = (v: any) => v ? JSON.parse(JSON.stringify(v)) : v;
        const getSection = (singular: string, plural: string, defaultValue: any) => {
          if (original[singular]) return clone(original[singular]);
          if (original[plural]) {
            const val = Array.isArray(original[plural]) ? original[plural][0] : original[plural];
            return clone(val) || defaultValue;
          }
          return defaultValue;
        };

        const payload: any = { patient: { ...(patientGroup ? patientGroup.value : {}) } };
        if (original.admissions && Array.isArray(original.admissions)) {
          payload.admissions = clone(original.admissions);
          payload.admission = clone(original.admissions[0]) || new Admission();
        } else {
          payload.admission = clone(original.admission) || new Admission();
          payload.admissions = payload.admission ? [clone(payload.admission)] : [];
        }
        if (original.surgicalInterventions && Array.isArray(original.surgicalInterventions)) {
          payload.surgicalInterventions = clone(original.surgicalInterventions);
          payload.surgicalIntervention = clone(original.surgicalInterventions[0]) || new SurgicalIntervention();
        } else {
          payload.surgicalIntervention = clone(original.surgicalIntervention) || new SurgicalIntervention();
          payload.surgicalInterventions = payload.surgicalIntervention ? [clone(payload.surgicalIntervention)] : [];
        }
        if (original.followUps && Array.isArray(original.followUps)) {
          payload.followUps = clone(original.followUps);
          payload.followUp = clone(original.followUps[0]) || new FollowUp();
        } else {
          payload.followUp = clone(original.followUp) || new FollowUp();
          payload.followUps = payload.followUp ? [clone(payload.followUp)] : [];
        }
        if (original.patient && (original.patient.id || original.patient.patientId)) {
          if (original.patient.id) payload.patient.id = original.patient.id;
          if (original.patient.patientId) payload.patient.patientId = original.patient.patientId;
        }
        payload.patient = { ...(original.patient || {}), ...(payload.patient || {}) };
    this.patientService.updatePatientFull(payload).subscribe(() => {
          this.toastr.success('Patient updated successfully!', 'Success');
          this.router.navigate(['/patients']);
          this.modalService.dismissAll();
          this.RefreshData.emit(true);
        }, err => {
          this.toastr.error('Failed to update patient', 'Error');
        });
      } else {
        const newPayload: any = {
          patient: patientGroup ? patientGroup.value : this.patientForm.value,
          admission: new Admission(),
          surgicalIntervention: new SurgicalIntervention(),
          followUp: new FollowUp()
        };
    this.patientService.AddNewPatientFull(newPayload).subscribe(() => {
          this.toastr.success('Patient created successfully!', 'Success');
          this.router.navigate(['/patients']);
        }, err => {
          this.toastr.error('Failed to create patient', 'Error');
        });
      }
    }

  getPatientDataById(): any {
    if (this.PatientId) {
      this.patientService.getPatientById(this.PatientId).subscribe(res => {
        if (res && res.results) {
          this.loadedPatientFull = res.results;
          this.patientDataOnly = res.results.patient;
          const patientGroup = this.patientForm.get('patient') as FormGroup;
          if (patientGroup) {
            patientGroup.patchValue(this.patientDataOnly || {});
          } else {
            this.patientForm.patchValue({ patient: this.patientDataOnly || {} });
          }
        }
      }, err => {
       
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }
  DismissModal() {
    this.modalService.dismissAll();
  }
}
