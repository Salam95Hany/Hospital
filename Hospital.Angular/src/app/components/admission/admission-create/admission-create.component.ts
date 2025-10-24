import { Component, OnInit } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormService } from '../../../services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators, RegexType } from '../../../services/custom-validators';
import { AuthService } from '../../../auth/auth.service';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admission-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminBreadcrumbComponent],
  templateUrl: './admission-create.component.html',
  styleUrl: './admission-create.component.css',
  providers: [DatePipe]
})
export class AdmissionCreateComponent implements OnInit {
  courses = [
    { id: 'Progressing', name: 'Progressing' },
    { id: 'Stationary', name: 'Stationary' },
    { id: 'Regressing', name: 'Regressing' },
    { id: 'On & off', name: 'On & off' }
  ];
  bmis = [
    { id: 'low', name: 'low' },
    { id: 'Average', name: 'Average' },
    { id: 'Overweight', name: 'Overweight' },
    { id: 'Obese', name: 'Obese' },
    { id: 'Morbidly obese', name: 'Morbidly obese' }
  ];
  comorbidities = [
    { id: 'Diabetes', name: 'Diabetes' },
    { id: 'Hypertension', name: 'Hypertension' },
    { id: 'Cardiac', name: 'Cardiac' },
    { id: 'Chest', name: 'Chest' },
    { id: 'Renal insufficiency', name: 'Renal insufficiency' },
    { id: 'Orthopedic', name: 'Orthopedic' },
    { id: 'Neurologic', name: 'Neurologic' },
    { id: 'Others', name: 'Others' }
  ];
  urineAnalyses = [
    { id: 'Pus cells', name: 'Pus cells' },
    { id: 'RBCs', name: 'RBCs' },
    { id: 'Crystals', name: 'Crystals' },
    { id: 'Albumin', name: 'Albumin' },
    { id: 'Sugar', name: 'Sugar' },
    { id: 'Others', name: 'Others' }
  ];
  UserId: any;
  ItemForm: FormGroup;
  AdmissionId: any;
  PatientId: any;
  formErrors = {
    hospitalFileNumber: '',
    admissionDate: '',
    course: ''
  };


  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private route: ActivatedRoute, private toaster: ToastrService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.AdmissionId = this.route.snapshot.queryParamMap.get('admissionId');
    this.PatientId = this.route.snapshot.queryParamMap.get('patientId');
    this.UserId = this.authService.userId;
    this.FormInit();
    if (this.AdmissionId)
      this.GetAdmissionById();

    if (!this.AdmissionId && !this.PatientId) {
      this.toaster.warning('Please select patient first');
      this.router.navigateByUrl('/admissions');
    }

  }

  FormInit() {
    this.ItemForm = this.fb.group({
      admissionId: 0,
      patientId: 0,
      hospitalFileNumber: ['', [Validators.required, CustomValidators.regexPattern(RegexType.noSpace)]],
      admissionDate: ['', [Validators.required]],
      dischargeDate: null,
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
      scheduledDate: null,
      insertUser: null
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
      admissionDate: this.datePipe.transform(item.admissionDate, 'yyyy-MM-dd') ?? '',
      dischargeDate: this.datePipe.transform(item.dischargeDate, 'yyyy-MM-dd') ?? '',
      chiefComplaint: item.chiefComplaint ?? null,
      duration: item.duration ?? null,
      course: item.course ?? '',
      hPI: item.hpi ?? null,
      comorbidities: item.comorbidities ?? null,
      currentMedications: item.currentMedications ?? null,
      pastHistory: item.pastHistory ?? null,
      familyHistory: item.familyHistory ?? null,
      bMI: item.bmi ?? null,
      temperature: item.temperature ?? null,
      pulse: item.pulse ?? null,
      bloodPressure: item.bloodPressure ?? null,
      generalExamination: item.generalExamination ?? null,
      abdominalExamination: item.abdominalExamination ?? null,
      genitalExamination: item.genitalExamination ?? null,
      dREVaginalExamination: item.dreVaginalExamination ?? null,
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
      pSATotal: item.psaTotal ?? null,
      pSAFree: item.psaFree ?? null,
      pSARatio: item.psaRatio ?? null,
      otherLabResults: item.otherLabResults ?? null,
      pUT: item.put ?? null,
      ultrasound: item.ultrasound ?? null,
      tRUS: item.trus ?? null,
      cT: item.ct ?? null,
      mRI: item.mri ?? null,
      isotopeStudies: item.isotopeStudies ?? null,
      otherImaging: item.otherImaging ?? null,
      provisionalDiagnosis: item.provisionalDiagnosis ?? null,
      medicalDecision: item.medicalDecision ?? null,
      scheduledDate: this.datePipe.transform(item.scheduledDate, 'yyyy-MM-dd') ?? null
    });
  }

  GetAdmissionById() {
    this.adminService.GetAdmissionById(this.AdmissionId).subscribe(res => {
      if (res.results)
        this.FillEditForm(res.results);
    })
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
    debugger;
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return;

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.PatientId)
      this.ItemForm.patchValue({ patientId: this.PatientId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.PatientId) {
      this.adminService.AddNewAdmission(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.router.navigateByUrl('/admissions');
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.adminService.UpdateAdmission(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.router.navigateByUrl('/admissions');
        }
        else
          this.toaster.error(data.message);
      });
    }
  }
}
