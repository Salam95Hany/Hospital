import { Component, OnInit } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { PatientService } from '../../../services/patient.service';
import { FormService } from '../../../services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators, RegexType } from '../../../services/custom-validators';
import { AuthService } from '../../../auth/auth.service';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";

@Component({
  selector: 'app-admission-create',
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminBreadcrumbComponent],
  templateUrl: './admission-create.component.html',
  styleUrl: './admission-create.component.css'
})
export class AdmissionCreateComponent implements OnInit {
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
  UserId: any;
  ItemForm: FormGroup;
  formErrors = {
    hospitalFileNumber: '',
    admissionDate: '',
    course: ''
  };


  constructor(private patientService: PatientService, private formService: FormService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      admissionId: 0,
      patientId: 0,
      hospitalFileNumber: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
      admissionDate: ['', [Validators.required]],
      dischargeDate: true,
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

    this.ItemForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.patchValue({
      admissionId: item.admissionId ?? 0,
      patientId: item.patientId ?? 0,
      hospitalFileNumber: item.hospitalFileNumber ?? '',
      admissionDate: item.admissionDate ?? '',
      dischargeDate: item.dischargeDate ?? true,
      chiefComplaint: item.chiefComplaint ?? null,
      duration: item.duration ?? null,
      course: item.course ?? '',
      hPI: item.hPI ?? null,
      comorbidities: item.comorbidities ?? null,
      currentMedications: item.currentMedications ?? null,
      pastHistory: item.pastHistory ?? null,
      familyHistory: item.familyHistory ?? null,
      bMI: item.bMI ?? null,
      temperature: item.temperature ?? null,
      pulse: item.pulse ?? null,
      bloodPressure: item.bloodPressure ?? null,
      generalExamination: item.generalExamination ?? null,
      abdominalExamination: item.abdominalExamination ?? null,
      genitalExamination: item.genitalExamination ?? null,
      dREVaginalExamination: item.dREVaginalExamination ?? null,
      urineAnalysis: item.urineAnalysis ?? null,
      cultureAndSensitivity: item.cultureAndSensitivity ?? null,
      serumCreatinine: item.serumCreatinine ?? null,
      hemoglobin: item.hemoglobin ?? null,
      totalLeukocyteCount: item.totalLeukocyteCount ?? null,
      platelets: item.platelets ?? null,
      pT_PTT_INR: item.pT_PTT_INR ?? null,
      liverEnzymes: item.liverEnzymes ?? null,
      fastingBloodSugar: item.fastingBloodSugar ?? null,
      postPrandialBloodSugar: item.postPrandialBloodSugar ?? null,
      hbA1c: item.hbA1c ?? null,
      pSATotal: item.pSATotal ?? null,
      pSAFree: item.pSAFree ?? null,
      pSARatio: item.pSARatio ?? null,
      otherLabResults: item.otherLabResults ?? null,
      pUT: item.pUT ?? null,
      ultrasound: item.ultrasound ?? null,
      tRUS: item.tRUS ?? null,
      cT: item.cT ?? null,
      mRI: item.mRI ?? null,
      isotopeStudies: item.isotopeStudies ?? null,
      otherImaging: item.otherImaging ?? null,
      provisionalDiagnosis: item.provisionalDiagnosis ?? null,
      medicalDecision: item.medicalDecision ?? null,
      scheduledDate: item.scheduledDate ?? null
    });
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

    if (this.ItemForm.controls['admissionId'].value == 0) {
      // this.patientService.AddNewActivity(this.ItemForm.value).subscribe(data => {
      //   if (data.isSuccess) {
      //     this.toaster.success(data.message);
      //   }
      //   else
      //     this.toaster.error(data.message);
      // });
    } else {
      // this.patientService.UpdateActivity(formData).subscribe(data => {
      //   if (data.isSuccess) {
      //   }
      //   else
      //     this.toaster.error(data.message);
      // });
    }
  }
}
