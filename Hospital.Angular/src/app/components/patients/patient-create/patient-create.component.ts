import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Admission, FollowUp, Patient, PatientData, SurgicalIntervention } from '../../../models/patient.model';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { CustomValidators, RegexType } from '../../../services/custom-validators';
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';
import { AdminDropDownComponent } from '../../../shared/admin-drop-down/admin-drop-down.component';
import { ToastrService } from 'ngx-toastr';
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';
import { AdminService } from '../../../services/admin.service';
import { AdminSliderImageComponent } from '../../../shared/admin-slider-image/admin-slider-image.component';
import { AdminUploadFileComponent } from '../../../shared/admin-upload-file/admin-upload-file.component';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    AdminGeneralInputComponent,
    AdminDropDownComponent,AdminSliderImageComponent, AdminUploadFileComponent],
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {
  patientData: PatientData = new PatientData();
  patientForm: FormGroup;
  currentStep: number = 1;
  SelectedFile: UploadFileModel;
  ImportedFiles: FilesModel[] = [];
  steps = [
    { title: 'Patient Information', isCompleted: false },
    { title: 'Admission Details', isCompleted: false },
    { title: 'Surgical Intervention', isCompleted: false },
    { title: 'Follow-Up', isCompleted: false }
  ];
  governorates = [
    { id: 1, name: 'Cairo' }, { id: 2, name: 'Giza' }, { id: 3, name: 'Alexandria' }, { id: 4, name: 'Dakahlia' }, { id: 5, name: 'Red Sea' }, { id: 6, name: 'Beheira' }, { id: 7, name: 'Fayoum' },
    { id: 8, name: 'Gharbia' }, { id: 9, name: 'Ismailia' }, { id: 10, name: 'Menofia' }, { id: 11, name: 'Minya' }, { id: 12, name: 'Qalyubia' }, { id: 13, name: 'New Valley' }, { id: 14, name: 'Suez' },
    { id: 15, name: 'Aswan' }, { id: 16, name: 'Assiut' }, { id: 17, name: 'Beni Suef' }, { id: 18, name: 'Port Said' }, { id: 19, name: 'Damietta' }, { id: 20, name: 'Sharkia' }, { id: 21, name: 'Sohag' },
    { id: 22, name: 'Kafr El Sheikh' }, { id: 23, name: 'Luxor' }, { id: 24, name: 'Qena' }, { id: 25, name: 'North Sinai' }, { id: 26, name: 'South Sinai' }, { id: 27, name: 'Matrouh' }
  ];
  maritalStatuses = [
    { id: 1, name: 'Single' }, { id: 2, name: 'Married' }, { id: 3, name: 'Divorced' }, { id: 4, name: 'Widowed' }, { id: 5, name: 'Child' }
  ];
  patientId: number | null = null;
  isEditMode: boolean = false;

  courses = [
    { id: 1, name: 'Progressing' },
    { id: 2, name: 'Stationary' },
    { id: 3, name: 'Regressing' },
    { id: 4, name: 'On & off' }
  ];
  bmis = [
    { id: 1, name: 'low' },
    { id: 2, name: 'Average' },
    { id: 3, name: 'Overweight' },
    { id: 4, name: 'Obese' },
    { id: 5, name: 'Morbidly obese' }
  ];
  comorbidities = [
    { id: 1, name: 'Diabetes' },
    { id: 2, name: 'Hypertension' },
    { id: 3, name: 'Cardiac' },
    { id: 4, name: 'Chest' },
    { id: 5, name: 'Renal insufficiency' },
    { id: 6, name: 'Orthopedic' },
    { id: 7, name: 'Neurologic' },
    { id: 8, name: 'Others' }
  ];
  urineAnalyses = [
    { id: 1, name: 'Pus cells' },
    { id: 2, name: 'RBCs' },
    { id: 3, name: 'Crystals' },
    { id: 4, name: 'Albumin' },
    { id: 5, name: 'Sugar' },
    { id: 6, name: 'Others' }
  ];
  theatres = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'Main' },
    { id: 5, name: 'Dpt' },
    { id: 6, name: 'US' }
  ];
  anaesthesias = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Regional' },
    { id: 3, name: 'Local' }
  ];
  tubesFixed = [
    { id: 1, name: 'Drain' },
    { id: 2, name: 'Urethral catheter' },
    { id: 3, name: 'S. Pubic catheter' },
    { id: 4, name: 'Ureteric catheter' },
    { id: 5, name: 'Ureteric Stent' },
    { id: 6, name: 'Nephrostomy' },
    { id: 7, name: 'Others' }
  ];
  categories = [
    { id: 1, name: 'Urolithiasis' },
    { id: 2, name: 'Oncology' },
    { id: 3, name: 'LUTD' },
    { id: 4, name: 'Reconstructive' },
    { id: 5, name: 'Andrology' },
    { id: 6, name: 'Pediatric' }
  ];
  approaches = [
    { id: 1, name: 'Endourology' },
    { id: 2, name: 'Open Surgery' },
    { id: 3, name: 'Laparoscopy' },
    { id: 4, name: 'Microscopic' }
  ];
  organs = [
    { id: 1, name: 'Adrenal' },
    { id: 2, name: 'Kidney' },
    { id: 3, name: 'Ureter' },
    { id: 4, name: 'Bladder' },
    { id: 5, name: 'Prostate' },
    { id: 6, name: 'Urethra' },
    { id: 7, name: 'Penis' },
    { id: 8, name: 'Scrotum/Testes' },
    { id: 9, name: 'Others' }
  ];
  intraOpCourses = [
    { id: 1, name: 'Smooth' },
    { id: 2, name: 'Minor adv. Events' },
    { id: 3, name: 'Moderate adv. Events' },
    { id: 4, name: 'Major dv. events' }
  ];
  postOpCourses = [
    { id: 1, name: 'Smooth' },
    { id: 2, name: 'Minor adv. Events' },
    { id: 3, name: 'Moderate adv. Events' },
    { id: 4, name: 'Major dv. events' }
  ];
  patientRemarks = [
    { id: 1, name: 'Better' },
    { id: 2, name: 'Worse' },
    { id: 3, name: 'The same' },
    { id: 4, name: 'Details' }
  ];

  formErrors = {
    hospitalFileNumber: '',
    admissionDate: '',
    dischargeDate : '',
    course: '',
    interventionDate: '',
    theater: '',
    followUpDate: '',
    patientRemarksStatus: '',
    nationalId: '',
    name: '',
  };
  form: FormGroup<any>;
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private formService: FormService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupFormValueChanges();
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
      admission: this.createAdmissionFormGroup(),
      surgicalIntervention: this.createSurgicalInterventionFormGroup(),
      followUp: this.createFollowUpFormGroup()
    });
  }
  OnFileChange(selectedFile: UploadFileModel) {
    this.SelectedFile = selectedFile;
  }
  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.patientId, ActionTypes.Patient).subscribe(res => {
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

    this.admission.valueChanges.subscribe(() => {
      this.clearErrorsForFormGroup(this.admission);
      this.validateAdmissionDates();
    });

    this.surgicalIntervention.valueChanges.subscribe(() => {
      this.clearErrorsForFormGroup(this.surgicalIntervention);
    });

    this.followUp.valueChanges.subscribe(() => {
      this.clearErrorsForFormGroup(this.followUp);
    });

    // Subscribe to admission date changes specifically for validation
    this.admission.get('admissionDate').valueChanges.subscribe(() => {
      this.validateAdmissionDates();
    });

    this.admission.get('dischargeDate').valueChanges.subscribe(() => {
      this.validateAdmissionDates();
    });
  }

  createAdmissionFormGroup(): FormGroup {
    return this.fb.group({
      hospitalFileNumber: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
      admissionDate: ['', [Validators.required]],
      dischargeDate: ['', [Validators.required]],
      chiefComplaint: null,
      duration: null,
      course: ['', [Validators.required]],
      hPI: null,
      comorbidities: null,
      currentMedications: null,
      pastHistory: null,
      familyHistory: null,
      bMI: null,
      temperature: null,
      pulse: null,
      bloodPressure: null,
      generalExamination: null,
      abdominalExamination: null,
      genitalExamination: null,
      dREVaginalExamination: null,
      urineAnalysis: null,
      cultureAndSensitivity: null,
      serumCreatinine: null,
      hemoglobin: null,
      totalLeukocyteCount: null,
      platelets: null,
      pT_PTT_INR: null,
      liverEnzymes: null,
      fastingBloodSugar: null,
      postPrandialBloodSugar: null,
      hbA1c: null,
      pSATotal: null,
      pSAFree: null,
      pSARatio: null,
      otherLabResults: null,
      pUT: null,
      ultrasound: null,
      tRUS: null,
      cT: null,
      mRI: null,
      isotopeStudies: null,
      otherImaging: null,
      provisionalDiagnosis: null,
      medicalDecision: null,
      scheduledDate: null
    });
  }

  createSurgicalInterventionFormGroup(): FormGroup {
    return this.fb.group({
      interventionDate: [null],
      theater: [null],
      mainSurgeon: [null],
      assistants: [null],
      resident: [null],
      otherSurgeons: [null],
      offFieldSupervisor: [null],
      anesthesia: [null],
      intervention: [null],
      interventionDetails: [null],
      tubesFixed: [null],
      category: [null],
      approach: [null],
      organ: [null],
      intraOperativeCourse: [null],
      intraOpAdverseEvents: [null],
      bloodTransfusionUnits: [null],
      postOpRecommendations: [null],
      postOpDay0_1: [null],
      postOpDay2_5: [null],
      postOpDayOver5: [null],
      postOpAdverseEvents: [null],
      dischargeDate: [null],
      finalDiagnosis: [null],
      dischargeInstructions: [null],
      followUpDoctor: [null],
      followUpDoctorPhone: [null],
      followUpAppointment: [null],
    });
  }

  createFollowUpFormGroup(): FormGroup {
    return this.fb.group({
      followUpDate: [null],
      patientRemarksStatus: [null],
      patientRemarksDetails: [null],
      examinationFindings: [null],
      woundStatus: [null],
      catheters: [null],
      labResults: [null],
      imagingResults: [null],
      imagePath: [null],
      advice: [null],
      newDecision: [null],
      nextFollowUpDate: [null]
    });
  }

  get patient(): FormGroup {
    return this.patientForm.get('patient') as FormGroup;
  }

  get admission(): FormGroup {
    return this.patientForm.get('admission') as FormGroup;
  }

  get surgicalIntervention(): FormGroup {
    return this.patientForm.get('surgicalIntervention') as FormGroup;
  }

  get followUp(): FormGroup {
    return this.patientForm.get('followUp') as FormGroup;
  }

  

  deletePatient(): void {
    if (this.patientId) {
      if (confirm('Are you sure you want to delete this patient and all related data?')) {
        this.patientService.deletePatientWithAllData(this.patientId).subscribe({
        next: () => {
          this.toastr.success('Patient deleted successfully!', 'Success');
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.toastr.error('Failed to delete patient', 'Error');
        }
      });
      }
    }
  }
  // Navigation Methods
  nextStep(): void {
    // Validate current step before proceeding
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.steps.length) {
        this.steps[this.currentStep - 1].isCompleted = true;
        this.currentStep++;
      }
    } else {
      // Show validation errors
      this.showValidationErrors();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validation methods
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
      case 2:
        return this.patientForm.get('admission') as FormGroup;
      case 3:
        return this.patientForm.get('surgicalIntervention') as FormGroup;
      case 4:
        return this.patientForm.get('followUp') as FormGroup;
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
      this.admission,
      this.surgicalIntervention,
      this.followUp
    ];

    formGroups.forEach(formGroup => {
      this.clearErrorsForFormGroup(formGroup);
    });
  }

  clearErrorsForFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.valid && this.formErrors[key]) {
        // Clear the error if the field becomes valid (regardless of touched state)
        delete this.formErrors[key];
      }
    });
  }

  validateAdmissionDates() {
    const admissionDate = this.admission.get('admissionDate').value;
    const dischargeDate = this.admission.get('dischargeDate').value;

    if (admissionDate && dischargeDate) {
      const admission = new Date(admissionDate);
      const discharge = new Date(dischargeDate);

      // Check if admission date is after discharge date
      if (admission > discharge) {
        this.admission.get('dischargeDate').setErrors({ dateOrder: true });
        this.formErrors.dischargeDate = 'Discharge date must be after admission date';
        // Show toast notification
        this.toastr.error('Discharge date must be greater than admission date', 'Invalid Date Range');
      } else {
        // Clear the error if dates are valid
        this.admission.get('dischargeDate').setErrors(null);
        delete this.formErrors.dischargeDate;
        
        // Calculate and set the duration
        this.calculateDuration(admission, discharge);
      }
    } else {
      // Clear errors if either date is missing
      this.admission.get('dischargeDate').setErrors(null);
      delete this.formErrors.dischargeDate;
    }
  }

  calculateDuration(admission: Date, discharge: Date) {
    // Calculate difference in days
    const timeDiff = discharge.getTime() - admission.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Set the duration in the form
    this.admission.get('duration').setValue(`${daysDiff} days`);
  }

  savePatient(): void {
    this.patientForm = this.formService.TrimFormInputValue(this.patientForm);
    
    // Mark all form groups as touched to trigger validation
    this.markFormGroupTouched(this.patientForm.get('patient') as FormGroup);
    this.markFormGroupTouched(this.admission);
    this.markFormGroupTouched(this.surgicalIntervention);
    this.markFormGroupTouched(this.followUp);

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.patientForm.patchValue({ fileModel: this.SelectedFile });
    }
    
    // Check if the form is invalid by validating individual form groups
    const patientValid = (this.patientForm.get('patient') as FormGroup).valid;
    const admissionValid = this.admission.valid;
    const interventionValid = this.surgicalIntervention.valid;
    const followUpValid = this.followUp.valid;
    
    if (!patientValid || !admissionValid || !interventionValid || !followUpValid) {
        // Show validation errors for individual fields
        this.showValidationErrors();
        return;
    }

    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatientFull(this.patientForm.value).subscribe(() => {
        this.toastr.success('Patient updated successfully!', 'Success');
        this.router.navigate(['/patients']);
      });
    } else {
      this.patientService.AddNewPatientFull(this.patientForm.value).subscribe(() => {
        this.toastr.success('Patient created successfully!', 'Success');
        this.router.navigate(['/patients']);
      });
    }
  }
  

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }


  

}