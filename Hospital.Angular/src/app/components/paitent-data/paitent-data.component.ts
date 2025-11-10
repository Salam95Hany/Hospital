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
import { CommonModule, DatePipe } from '@angular/common';
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
  styleUrls: ['./paitent-data.component.css'],
  providers: [DatePipe]
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
  // patientDataOnly: import("d:/mine/Hospital/Hospital.Angular/src/app/models/patient.model").Patient;
  // full payload returned from getPatientById (contains patient, admissions, surgical, followUp)
  loadedPatientFull: any = null;
  patientDataOnly: any;
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private formService: FormService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private modalService: NgbModal,
    private datePipe: DatePipe
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
        internalNumber: [''],
        fileModel: null
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
  if (!patientValid) {
    this.showValidationErrors();
    return;
  }

  if (this.PatientId)
    this.patientForm.patchValue({ patientId: this.PatientId });

  const patientGroup = this.patientForm.get('patient') as FormGroup;
  const original = this.loadedPatientFull || {};
   if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0)
    this.patientForm.patchValue({ fileModel: this.SelectedFile });
  let payload: any;
  
  if (this.PatientId) {
    payload = {
      ...(original.patient || {}),
      ...(patientGroup?.value || {}),
      fileModel: this.SelectedFile || null
    };
  } else {
    payload = patientGroup ? patientGroup.value : this.patientForm.value;
  }

  

  const formData = new FormData();
  this.formService.buildFormData(formData, payload);
  const request$ = this.PatientId
    ? this.patientService.updatePatientFull(formData)
    : this.patientService.AddNewPatientFull(formData);

  request$.subscribe({
    next: () => {
      this.toastr.success(
        this.PatientId ? 'Patient updated successfully!' : 'Patient created successfully!',
        'Success'
      );
      this.router.navigate(['/admin/patients']);
      this.modalService.dismissAll();
      this.RefreshData.emit(true);
    },
    error: (error) => {
      console.error('Error saving patient:', error);
      this.toastr.error('Failed to save patient', 'Error');
    }
  });
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
    this.router.navigate(['/admin/patients']);
  }
  DismissModal() {
    this.modalService.dismissAll();
  }

 buildFormData(formData: FormData, data: any, parentKey: string | null = null) {
  if (data === null || data === undefined) return;

  if (data instanceof File) {
    formData.append(parentKey!, data);
  }
  else if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      this.buildFormData(formData, item, key);
    });
  }
  else if (typeof data === 'object' && !(data instanceof Date)) {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined) return;

      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // SPECIAL HANDLING FOR FILEMODEL
      if (key === 'fileModel' && value && typeof value === 'object') {
        // Handle files array
        if (value.files && Array.isArray(value.files)) {
          value.files.forEach((file: File, index: number) => {
            // Append files with proper field names
            formData.append('fileModel.insertUser', "123");
            formData.append('fileModel.files', file); // Single field
            formData.append(`fileModel.files[${index}]`, file); // Array format
          });
        }
        // Handle deleted files
        if (value.deletedFiles && Array.isArray(value.deletedFiles)) {
          formData.append('fileModel.deletedFiles', JSON.stringify(value.deletedFiles));
        }
      } 
      else if (key.toLowerCase().includes('file') && value instanceof File) {
        formData.append(fullKey, value);
      }
      else {
        this.buildFormData(formData, value, fullKey);
      }
    });
  }
  else {
    if (data !== '') {
      formData.append(parentKey!, data.toString());
    }
  }
}
}
