import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormService } from '../../../services/form.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { PatientService } from '../../../services/patient.service';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { NgbDropdownModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminSliderImageComponent } from "../../../shared/admin-slider-image/admin-slider-image.component";
import { AdminUploadFileComponent } from "../../../shared/admin-upload-file/admin-upload-file.component";
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';
import { CustomValidators } from '../../../services/custom-validators';
import { AdminDropDownMultiSelectComponent } from '../../../shared/admin-drop-down-multi-select/admin-drop-down-multi-select.component';

@Component({
  selector: 'app-admission-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, NgbModule, AdminSliderImageComponent, AdminUploadFileComponent,
    NgbDropdownModule, FormsModule, NgClass, NgIf, AdminDropDownMultiSelectComponent
  ],
  templateUrl: './admission-create.component.html',
  styleUrl: './admission-create.component.css',
  providers: [DatePipe]
})
export class AdmissionCreateComponent implements OnInit {
  @Input() PatientId: any;
  @Input() AdmissionId: any;
  @Input() DetailsMode = false;
  @Input() PatientMode = false;
  @Output() RefreshData = new EventEmitter<boolean>();
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
  Branches = [
    { id: 'Al-Hussain', name: 'Al-Hussain' },
    { id: 'Sayed Galal', name: 'Sayed Galal' },
  ];
  UserId: any;
  ItemForm: FormGroup;
  SelectedFile: UploadFileModel;
  BtnDisabled = false;
  ImportedFiles: FilesModel[] = [];
  selectedValue = 'Select Urine Analysis';
  UrineInputValue = '';
  formErrors = {
    hospitalFileNumber: '',
    chiefComplaint: '',
    hPI: '',
    provisionalDiagnosis: '',
    hospitalBranch: '',
    admissionDate: '',
    dischargeDate: '',
    scheduledDate: ''
  };


  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private datePipe: DatePipe, private modalService: NgbModal, private patientService: PatientService) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
    if (!this.AdmissionId) {
      this.setupHospitalFileNumberValidation();
    }
    this.setupDurationBinding();
    this.setupPsaRatioBinding();
    if (this.AdmissionId) {
      this.GetAdmissionById();
      this.GetFilesByActionId();
      this.removeDateValidationForEdit();
    }
    if (this.DetailsMode) {
      this.ItemForm.disable();
    }
  }

  removeDateValidationForEdit() {
    this.ItemForm.get('admissionDate')?.setValidators([Validators.required]);
    this.ItemForm.get('scheduledDate')?.clearValidators();

    this.ItemForm.get('admissionDate')?.updateValueAndValidity();
    this.ItemForm.get('scheduledDate')?.updateValueAndValidity();
  }

  private setupHospitalFileNumberValidation(): void {
    const ctrl = this.ItemForm.get('hospitalFileNumber');
    if (!ctrl) return;
    ctrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) => {
          const trimmed = (value ?? '').trim();
          if (!trimmed) {
            return of([]);
          }
          return this.patientService.GetHospitalFileNumber(trimmed);
        })
      )
      .subscribe((results: any[]) => {
        let hasConflict = false;
        if (Array.isArray(results) && results.length > 0) {
          if (this.PatientId) {
            const currentPatientId = this.PatientId;
            const otherPatientRecords = results.filter((r: any) => {
              const pid = r.patientId ?? r.PatientId;
              if (pid == null) {
                return true;
              }
              return pid !== currentPatientId;
            });
            hasConflict = otherPatientRecords.length > 0;
          } else {
            hasConflict = true;
          }
        }
        if (hasConflict) {
          this.formErrors.hospitalFileNumber = 'Hospital file number already exists';
          ctrl.setErrors({ ...(ctrl.errors || {}), duplicate: true });
          this.BtnDisabled = true;
        } else {
          // Clear duplicate error while preserving other errors
          const { duplicate, ...otherErrors } = ctrl.errors || {};
          const newErrors = Object.keys(otherErrors).length ? otherErrors : null;
          ctrl.setErrors(newErrors);
          this.BtnDisabled = false;
        }
      });
  }

  private setupDurationBinding(): void {
    const admissionCtrl = this.ItemForm.get('admissionDate');
    const dischargeCtrl = this.ItemForm.get('dischargeDate');
    if (!admissionCtrl || !dischargeCtrl) return;

    const updateDuration = () => {
      const admissionDate = admissionCtrl.value;
      const dischargeDate = dischargeCtrl.value;
      if (admissionDate && dischargeDate) {
        const admission = new Date(admissionDate);
        const discharge = new Date(dischargeDate);
        if (discharge >= admission) {
          const diffMs = discharge.getTime() - admission.getTime();
          const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          this.ItemForm.get('duration')?.setValue(`${days} days`, { emitEvent: false });
        } else {
          this.ItemForm.get('duration')?.setValue(null, { emitEvent: false });
        }
      } else {
        this.ItemForm.get('duration')?.setValue(null, { emitEvent: false });
      }
    };

    admissionCtrl.valueChanges.subscribe(() => updateDuration());
    dischargeCtrl.valueChanges.subscribe(() => updateDuration());
    updateDuration();
  }

  private setupPsaRatioBinding(): void {
    const freeCtrl = this.ItemForm.get('pSAFree');
    const totalCtrl = this.ItemForm.get('pSATotal');
    const ratioCtrl = this.ItemForm.get('pSARatio');
    if (!freeCtrl || !totalCtrl || !ratioCtrl) return;

    const parseNum = (v: any): number | null => {
      if (v === null || v === undefined || v === '') return null;
      if (typeof v === 'number') return isNaN(v) ? null : v;
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    };

    const updateRatio = () => {
      const free = parseNum(freeCtrl.value);
      const total = parseNum(totalCtrl.value);
      if (free !== null && total !== null && total > 0) {
        const ratioPercent = (free / total) * 100;
        ratioCtrl.setValue(Number.isFinite(ratioPercent) ? ratioPercent.toFixed(2) : null, { emitEvent: false });
      } else {
        ratioCtrl.setValue(null, { emitEvent: false });
      }
    };

    freeCtrl.valueChanges.subscribe(() => updateRatio());
    totalCtrl.valueChanges.subscribe(() => updateRatio());
    updateRatio();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      admissionId: 0,
      patientId: 0,
      hospitalFileNumber: ['', [Validators.required]],
      admissionDate: ['', [Validators.required, CustomValidators.dateLessThanToday(new Date(), 'Admission date must be after or equal today')]],
      dischargeDate: ['', [CustomValidators.dateLessThanToday(new Date(), 'Discharge date must be after or equal today')]],
      hospitalBranch: ['', [Validators.required]],
      chiefComplaint: ['', [Validators.required]],
      duration: null,
      course: null,
      hPI: ['', [Validators.required]],
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
      urinePusCells: null,
      urineRBCs: null,
      urineCrystals: null,
      urineAlbumin: null,
      urineSugar: null,
      urineOthers: null,
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
      provisionalDiagnosis: ['', [Validators.required]],
      medicalDecision: null,
      scheduledDate: ['', [CustomValidators.dateLessThanToday(new Date(), 'Scheduled date must be after or equal today')]],
      insertUser: null,
      fileModel: null
    }, {
      validators: [CustomValidators.endDateGreaterThanStartDate('admissionDate', 'dischargeDate', 'Discharge date must be after admission date')],
    });

    this.ItemForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    if (item.urineAnalysis) {
      const urineParts = item.urineAnalysis.split(';');
      this.selectedValue = urineParts[0];
      this.UrineInputValue = urineParts[1];
    }
    this.ItemForm.patchValue({
      admissionId: item.admissionId ?? 0,
      patientId: item.patientId ?? 0,
      hospitalFileNumber: item.hospitalFileNumber ?? '',
      hospitalBranch: item.hospitalBranch ?? '',
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
      urinePusCells: item.urinePusCells ?? null,
      urineRBCs: item.urineRBCs ?? null,
      urineCrystals: item.urineCrystals ?? null,
      urineAlbumin: item.urineAlbumin ?? null,
      urineSugar: item.urineSugar ?? null,
      urineOthers: item.urineOthers ?? null,
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
      scheduledDate: this.datePipe.transform(item.scheduledDate, 'yyyy-MM-dd') ?? '',
      fileModel: null,
      insertUser: null
    });
  }

  GetAdmissionById() {
    this.adminService.GetAdmissionById(this.AdmissionId).subscribe(res => {
      if (res.results)
        this.FillEditForm(res.results);
    })
  }

  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.AdmissionId, ActionTypes.Admission).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.Admission,
            fileName: i.fileName,
            existFileName: i.existFileName,
            fileUrl: i.fileUrl,
            fileSize: i.fileSize,
            mediaType: i.mediaType,
            file: null
          }
        });
      }
    })
  }

  RefreshImageData(item: boolean) {
    this.GetFilesByActionId();
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

  DismissModal() {
    this.modalService.dismissAll();
  }

  OnFileChange(selectedFile: UploadFileModel) {
    this.SelectedFile = selectedFile;
  }

  AddNewItem() {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return;

    // No dropdown; urine fields are bound directly to dedicated properties

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.PatientId)
      this.ItemForm.patchValue({ patientId: this.PatientId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }


    const formData = new FormData();
    const { pSATotal, pSAFree, pSARatio, ...rest } = this.ItemForm.value;
    const payload = {
      ...rest,
      psaTotal: pSATotal,
      psaFree: pSAFree,
      psaRatio: pSARatio
    };
    this.formService.buildFormData(formData, payload);
    this.BtnDisabled = true;
    if (!this.AdmissionId) {
      this.adminService.AddNewAdmission(formData).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.RefreshData.emit(true);
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.adminService.UpdateAdmission(formData).subscribe(data => {
        this.BtnDisabled = false;
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
          this.RefreshData.emit(true);
        }
        else
          this.toaster.error(data.message);
      });
    }
  }

  OnUrineAnalysisSelect(item: any) {
    this.selectedValue = item.id;
    // this.ItemForm.patchValue({ urineAnalysis: this.selectedValue + (this.UrineInputValue ? ' : ' + this.UrineInputValue : '') });
  }

  GetOutputData(): FormGroup<any> {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return null;

    // No dropdown; urine fields are bound directly to dedicated properties

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.PatientId)
      this.ItemForm.patchValue({ patientId: this.PatientId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }

    return this.ItemForm;
  }
}
