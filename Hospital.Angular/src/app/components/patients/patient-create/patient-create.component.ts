import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    AdminGeneralInputComponent,
    AdminDropDownComponent,AdminSliderImageComponent, AdminUploadFileComponent],
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css'],
  providers: [DatePipe]
})
export class PatientCreateComponent implements OnInit, OnChanges {
  patientData: PatientData = new PatientData();
  patientForm: FormGroup;
  currentStep: number = 1;
  SelectedFile: UploadFileModel;
  ImportedFiles: FilesModel[] = [];
  BtnDisabled = false;
  // Store files separately for each step
  patientFiles: UploadFileModel = {
    actionId: null,
    actionType: ActionTypes.Patient,
    insertUser: '',
    files: [],
    deletedFiles: []
  };
  
  admissionFiles: UploadFileModel = {
    actionId: null,
    actionType: ActionTypes.Admission,
    insertUser: '',
    files: [],
    deletedFiles: []
  };
  
  surgicalFiles: UploadFileModel = {
    actionId: null,
    actionType: ActionTypes.SurgicalIntervention,
    insertUser: '',
    files: [],
    deletedFiles: []
  };
  
  followUpFiles: UploadFileModel = {
    actionId: null,
    actionType: ActionTypes.FollowUp,
    insertUser: '',
    files: [],
    deletedFiles: []
  };
  // Read-only visibility flags
  hasAdmissionDetails: boolean = false;
  hasSurgicalDetails: boolean = false;
  hasFollowUpDetails: boolean = false;
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
  @Input() patientId: number | null = null;
  isEditMode: boolean = false;
  @Input() isReadOnly: boolean = false;

  courses = [
    { id: 1, name: 'Progressing' },
    { id: 2, name: 'Stationary' },
    { id: 3, name: 'Regressing' },
    { id: 4, name: 'On & off' }
  ];
  hospitalBranches = [
    { id: 1, name: 'Al-Hussien' },
    { id: 2, name: 'Saied Galal' },
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
    age: '',
    gender: '',
    hospitalBranch: '',
    chiefComplaint: '',
    hPI: '',  
    provisionalDiagnosis: '',
    intervention: '',
    interventionDetails: '',
    advice: ''
  };
  form: FormGroup<any>;
  @Output() RefreshData = new EventEmitter<boolean>();
  @Input() isModal: boolean = false;
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private formService: FormService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Get route parameters
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.patientId = +params['id'];
        this.isEditMode = true;
        this.GetFilesByActionId();
      }
    });
    
    this.initForm();
    this.setupFormValueChanges();
    // Duplicate check for hospital file number in admission step when creating a new patient
    if (!this.patientId) {
      this.setupHospitalFileNumberValidation();
    }

    // If patientId is provided via input (embedded usage), attempt to load last details
    this.tryLoadDataFromInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId'] || changes['isReadOnly']) {
      this.tryLoadDataFromInput();
    }
  }

  private tryLoadDataFromInput(): void {
    if (this.patientId && this.patientForm) {
      this.loadLastDetails(this.patientId);
    }
  }

  private setupHospitalFileNumberValidation(): void {
    const ctrl = this.admission.get('hospitalFileNumber');
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
        const exists = Array.isArray(results) && results.length > 0;
        if (exists) {
          this.formErrors.hospitalFileNumber = 'Hospital file number already exists';
          ctrl.setErrors({ ...(ctrl.errors || {}), duplicate: true });
          this.BtnDisabled = true;
        } else {
          const { duplicate, ...otherErrors } = ctrl.errors || {};
          const newErrors = Object.keys(otherErrors).length ? otherErrors : null;
          ctrl.setErrors(newErrors);
          this.formErrors.hospitalFileNumber = '';
          this.BtnDisabled = false;
        }
      });
  }

  initForm() {
    this.patientForm = this.fb.group({
      patient: this.fb.group({
        name: ['', Validators.required],
        birthDate: [null],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        nationalId: ['', [Validators.required]],
        address: null,
        governorate: [''],
        occupation: null,
        maritalStatus: [''],
        childrenCount: null,
        internalNumber: 1,
        fileModel: null
      }),
      admission: this.createAdmissionFormGroup(),
      surgicalIntervention: this.createSurgicalInterventionFormGroup(),
      followUp: this.createFollowUpFormGroup()
    });
    
    // Set actionId for file objects if patientId exists
    if (this.patientId) {
      this.patientFiles.actionId = this.patientId;
      this.admissionFiles.actionId = this.patientId;
      this.surgicalFiles.actionId = this.patientId;
      this.followUpFiles.actionId = this.patientId;
    }

    // Disable all controls in read-only mode
    if (this.isReadOnly) {
      this.patientForm.disable({ emitEvent: false });
    }
  }
  OnFileChange(selectedFile: UploadFileModel) {
    // Store files based on current step
    switch (this.currentStep) {
      case 1:
        this.patientFiles = selectedFile;
        break;
      case 2:
        this.admissionFiles = selectedFile;
        break;
      case 3:
        this.surgicalFiles = selectedFile;
        break;
      case 4:
        this.followUpFiles = selectedFile;
        break;
    }
    
    // Also keep the SelectedFile for backward compatibility
    this.SelectedFile = selectedFile;
  }
  GetFilesByActionId() {
    // Load files for all steps
    const actionTypes = [
      ActionTypes.Patient,
      ActionTypes.Admission,
      ActionTypes.SurgicalIntervention,
      ActionTypes.FollowUp
    ];
    
    this.ImportedFiles = [];
    
    actionTypes.forEach(actionType => {
      this.adminService.GetFilesByActionId(this.patientId, actionType).subscribe(res => {
        if (res.results) {
          const files = res.results.map<FilesModel>(i => {
            return {
              attachmentId: i.attachmentId,
              actionType: actionType,
              fileName: i.fileName,
              existFileName: i.existFileName,
              fileUrl: i.fileUrl,
              fileSize: i.fileSize,
              file: null
            }
          });
          this.ImportedFiles.push(...files);
        }
      });
    });
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

    // Subscribe to surgical discharge date to toggle required validators
    const surgicalDischargeCtrl = this.surgicalIntervention.get('dischargeDate');
    if (surgicalDischargeCtrl) {
      // Initialize validators based on initial value
      this.updateSurgicalValidatorsBasedOnDischarge();

      surgicalDischargeCtrl.valueChanges.subscribe(() => {
        this.updateSurgicalValidatorsBasedOnDischarge();
      });
    }
  }

  private loadLastDetails(id: number): void {
    // Fetch last details and patch the form groups to mirror the create controls
    this.patientService.getPatientLastDetailsById(id).subscribe({
      next: (res: any) => {
        const data = res?.results ?? res ?? {};
        const pas = (data?.Patient || data?.patient) || {};
        const adm = (data?.LastAdmission || data?.lastAdmission) || {};
        const surg = (data?.LastSurgicalIntervention || data?.lastSurgicalIntervention) || {};
        const fol = (data?.LastFollowUp || data?.lastFollowUp) || {};

        // Patient group
        this.patient.patchValue({
          name: pas.name ?? pas.Name ?? null,
          birthDate: this.datePipe.transform(pas.birthDate ?? pas.BirthDate, 'yyyy-MM-dd') ?? null,
          age: pas.age ?? pas.Age ?? null,
          gender: pas.gender ?? pas.Gender ?? null,
          nationalId: pas.nationalId ?? pas.NationalId ?? null,
          address: pas.address ?? pas.Address ?? null,
          governorate: pas.governorate ?? pas.Governorate ?? null,
          occupation: pas.occupation ?? pas.Occupation ?? null,
          maritalStatus: pas.maritalStatus ?? pas.MaritalStatus ?? null,
          childrenCount: pas.childrenCount ?? pas.ChildrenCount ?? null,
          internalNumber: pas.internalNumber ?? pas.InternalNumber ?? null,
        });

        // Admission group
        this.admission.patchValue({
          hospitalBranch: adm.hospitalBranch ?? adm.HospitalBranch ?? null,
          chiefComplaint: adm.chiefComplaint ?? adm.ChiefComplaint ?? null,
          duration: adm.duration ?? adm.Duration ?? null,
          hospitalStates: adm.hospitalStates ?? adm.HospitalStates ?? null,
          course: adm.course ?? adm.Course ?? null,
          hPI: adm.hPI ?? adm.HPI ?? null,
          currentMedications: adm.currentMedications ?? adm.CurrentMedications ?? null,
          pastHistory: adm.pastHistory ?? adm.PastHistory ?? null,
          familyHistory: adm.familyHistory ?? adm.FamilyHistory ?? null,
          bMI: adm.bMI ?? adm.BMI ?? null,
          pulse: adm.pulse ?? adm.Pulse ?? null,
          bloodPressure: adm.bloodPressure ?? adm.BloodPressure ?? null,
          temperature: adm.temperature ?? adm.Temperature ?? null,
          generalExamination: adm.generalExamination ?? adm.GeneralExamination ?? null,
          abdominalExamination: adm.abdominalExamination ?? adm.AbdominalExamination ?? null,
          genitalExamination: adm.genitalExamination ?? adm.GenitalExamination ?? null,
          dREVaginalExamination: adm.dREVaginalExamination ?? adm.DREVaginalExamination ?? null,
          otherLabResults: adm.otherLabResults ?? adm.OtherLabResults ?? null,
          provisionalDiagnosis: adm.provisionalDiagnosis ?? adm.ProvisionalDiagnosis ?? null,
          medicalDecision: adm.medicalDecision ?? adm.MedicalDecision ?? null,
          cultureAndSensitivity: adm.cultureAndSensitivity ?? adm.CultureAndSensitivity ?? null,
          serumCreatinine: adm.serumCreatinine ?? adm.SerumCreatinine ?? null,
          hemoglobin: adm.hemoglobin ?? adm.Hemoglobin ?? null,
          totalLeukocyteCount: adm.totalLeukocyteCount ?? adm.TotalLeukocyteCount ?? null,
          platelets: adm.platelets ?? adm.Platelets ?? null,
          pT_PTT_INR: adm.pT_PTT_INR ?? adm.PT_PTT_INR ?? null,
          liverEnzymes: adm.liverEnzymes ?? adm.LiverEnzymes ?? null,
          fastingBloodSugar: adm.fastingBloodSugar ?? adm.FastingBloodSugar ?? null,
          postPrandialBloodSugar: adm.postPrandialBloodSugar ?? adm.PostPrandialBloodSugar ?? null,
          hbA1c: adm.hbA1c ?? adm.HbA1c ?? null,
          pSATotal: adm.pSATotal ?? adm.PSATotal ?? null,
          pSAFree: adm.pSAFree ?? adm.PSAFree ?? null,
          pSARatio: adm.pSARatio ?? adm.PSARatio ?? null,
          pUT: adm.pUT ?? adm.PUT ?? null,
          ultrasound: adm.ultrasound ?? adm.Ultrasound ?? null,
          tRUS: adm.tRUS ?? adm.TRUS ?? null,
          cT: adm.cT ?? adm.CT ?? null,
          mRI: adm.mRI ?? adm.MRI ?? null,
          isotopeStudies: adm.isotopeStudies ?? adm.IsotopeStudies ?? null,
          otherImaging: adm.otherImaging ?? adm.OtherImaging ?? null,
          scheduledDate: this.datePipe.transform(adm.scheduledDate ?? adm.ScheduledDate, 'yyyy-MM-dd') ?? null,
          hospitalFileNumber: adm.hospitalFileNumber ?? adm.HospitalFileNumber ?? null,
          admissionDate: this.datePipe.transform(adm.admissionDate ?? adm.AdmissionDate, 'yyyy-MM-dd') ?? null,
          dischargeDate: this.datePipe.transform(adm.dischargeDate ?? adm.DischargeDate, 'yyyy-MM-dd') ?? null,
        });

        // Surgical group
        this.surgicalIntervention.patchValue({
          interventionDate: this.datePipe.transform(surg.interventionDate ?? surg.InterventionDate, 'yyyy-MM-dd') ?? null,
          theater: surg.theater ?? surg.Theater ?? null,
          mainSurgeon: surg.mainSurgeon ?? surg.MainSurgeon ?? null,
          assistants: surg.assistants ?? surg.Assistants ?? null,
          resident: surg.resident ?? surg.Resident ?? null,
          otherSurgeons: surg.otherSurgeons ?? surg.OtherSurgeons ?? null,
          offFieldSupervisor: surg.offFieldSupervisor ?? surg.OffFieldSupervisor ?? null,
          anesthesia: surg.anesthesia ?? surg.Anesthesia ?? null,
          intervention: surg.intervention ?? surg.Intervention ?? null,
          interventionDetails: surg.interventionDetails ?? surg.InterventionDetails ?? null,
          tubesFixed: surg.tubesFixed ?? surg.TubesFixed ?? null,
          category: surg.category ?? surg.Category ?? null,
          approach: surg.approach ?? surg.Approach ?? null,
          organ: surg.organ ?? surg.Organ ?? null,
          intraOperativeCourse: surg.intraOperativeCourse ?? surg.IntraOperativeCourse ?? null,
          intraOpAdverseEvents: surg.intraOpAdverseEvents ?? surg.IntraOpAdverseEvents ?? null,
          bloodTransfusionUnits: surg.bloodTransfusionUnits ?? surg.BloodTransfusionUnits ?? null,
          postOpRecommendations: surg.postOpRecommendations ?? surg.PostOpRecommendations ?? null,
          postOpDay0_1: surg.postOpDay0_1 ?? surg.PostOpDay0_1 ?? null,
          postOpDay2_5: surg.postOpDay2_5 ?? surg.PostOpDay2_5 ?? null,
          postOpDayOver5: surg.postOpDayOver5 ?? surg.PostOpDayOver5 ?? null,
          postOpAdverseEvents: surg.postOpAdverseEvents ?? surg.PostOpAdverseEvents ?? null,
          dischargeDate: this.datePipe.transform(surg.dischargeDate ?? surg.DischargeDate, 'yyyy-MM-dd') ?? null,
          finalDiagnosis: surg.finalDiagnosis ?? surg.FinalDiagnosis ?? null,
          dischargeInstructions: surg.dischargeInstructions ?? surg.DischargeInstructions ?? null,
          followUpDoctor: surg.followUpDoctor ?? surg.FollowUpDoctor ?? null,
          followUpDoctorPhone: surg.followUpDoctorPhone ?? surg.FollowUpDoctorPhone ?? null,
          followUpAppointment: this.datePipe.transform(surg.followUpAppointment ?? surg.FollowUpAppointment, 'yyyy-MM-dd') ?? null,
        });

        // Follow-up group
        this.followUp.patchValue({
          followUpDate: this.datePipe.transform(fol.followUpDate ?? fol.FollowUpDate, 'yyyy-MM-dd') ?? null,
          patientRemarksStatus: fol.patientRemarksStatus ?? fol.PatientRemarksStatus ?? null,
          patientRemarksDetails: fol.patientRemarksDetails ?? fol.PatientRemarksDetails ?? null,
          examinationFindings: fol.examinationFindings ?? fol.ExaminationFindings ?? null,
          woundStatus: fol.woundStatus ?? fol.WoundStatus ?? null,
          catheters: fol.catheters ?? fol.Catheters ?? null,
          labResults: fol.labResults ?? fol.LabResults ?? null,
          imagingResults: fol.imagingResults ?? fol.ImagingResults ?? null,
          imagePath: fol.imagePath ?? fol.ImagePath ?? null,
          advice: fol.advice ?? fol.Advice ?? null,
          newDecision: fol.newDecision ?? fol.NewDecision ?? null,
          nextFollowUpDate: this.datePipe.transform(fol.nextFollowUpDate ?? fol.NextFollowUpDate, 'yyyy-MM-dd') ?? null,
        });

        // Fetch files for slider if available
        this.GetFilesByActionId();

        // Disable form if read-only
        if (this.isReadOnly) {
          this.patientForm.disable({ emitEvent: false });
        }

        // Set visibility flags for read-only based on patched values
        const admVal = this.admission?.value;
        const surgVal = this.surgicalIntervention?.value;
        const folVal = this.followUp?.value;

        this.hasAdmissionDetails = this.hasAnyValue(admVal);
        this.hasSurgicalDetails = this.hasAnyValue(surgVal);
        this.hasFollowUpDetails = this.hasAnyValue(folVal);
      },
      error: (err) => {
        // Non-blocking: leave form empty in case of error
        console.error('Failed to load last details', err);
      }
    });
  }

  private hasAnyValue(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    return Object.values(obj).some((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return true; // numbers, booleans, dates considered present
    });
  }

  /**
   * When a discharge date is selected in Surgical step, make related fields mandatory.
   * If not selected, clear their required validators.
   */
  private updateSurgicalValidatorsBasedOnDischarge(): void {
    const fieldsToToggle = [
      'postOpDay0_1',
      'postOpDay2_5',
      'postOpDayOver5',
      'dischargeInstructions',
      'followUpDoctor',
      'followUpDoctorPhone',
      'followUpAppointment'
    ];

    const dischargeSelected = !!this.surgicalIntervention.get('dischargeDate')?.value;

    fieldsToToggle.forEach(key => {
      const ctrl = this.surgicalIntervention.get(key);
      if (!ctrl) return;
      if (dischargeSelected) {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.clearValidators();
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  createAdmissionFormGroup(): FormGroup {
    return this.fb.group({
      hospitalFileNumber: null,
      admissionDate: null,
      dischargeDate: null,
      hospitalStates: null,
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
      scheduledDate: null,
      fileModel: null
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
      fileModel: null
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
      nextFollowUpDate: [null],
      fileModel: null
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
          this.router.navigate(['/admin/patients']);
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
        this.calculateStates(admission, discharge);
      }
    } else {
      // Clear errors if either date is missing
      this.admission.get('dischargeDate').setErrors(null);
      delete this.formErrors.dischargeDate;
    }
  }

  calculateStates(admission: Date, discharge: Date) {
    // Calculate difference in days
    const timeDiff = discharge.getTime() - admission.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    this.admission.get('hospitalStates').setValue(`${daysDiff} days`);
  }

  savePatient(): void {
    this.patientForm = this.formService.TrimFormInputValue(this.patientForm);
    
    // Mark all form groups as touched to trigger validation
    this.markFormGroupTouched(this.patientForm.get('patient') as FormGroup);
    this.markFormGroupTouched(this.admission);
    this.markFormGroupTouched(this.surgicalIntervention);
    this.markFormGroupTouched(this.followUp);

    // Attach files to their respective step objects with API-ready shape
    const setModel = (group: FormGroup, model: UploadFileModel, actionType: ActionTypes) => {
      if ((model?.files?.length || 0) > 0 || (model?.deletedFiles?.length || 0) > 0) {
        group.get('fileModel').setValue(this.toApiFileModel(model, actionType));
      } else {
        group.get('fileModel').setValue(null);
      }
    };
    setModel(this.patientForm.get('patient') as FormGroup, this.patientFiles, ActionTypes.Patient);
    setModel(this.admission, this.admissionFiles, ActionTypes.Admission);
    setModel(this.surgicalIntervention, this.surgicalFiles, ActionTypes.SurgicalIntervention);
    setModel(this.followUp, this.followUpFiles, ActionTypes.FollowUp);
    
    const patientValid = (this.patientForm.get('patient') as FormGroup).valid;
    const admissionValid = this.admission.valid;
    const interventionValid = this.surgicalIntervention.valid;
    const followUpValid = this.followUp.valid;
    
    if (!patientValid || !admissionValid || !interventionValid || !followUpValid) {
        // Show validation errors for individual fields
        this.showValidationErrors();
        return;
    }
    // Build PascalCase payload with per-step FileModel for correct binding
    const patientGroup = this.patientForm.get('patient') as FormGroup;
    const { fileModel: _pFileModel, ...patientData } = (patientGroup?.value) || {};
    const { fileModel: _aFileModel, ...admissionData } = (this.admission?.value) || {};
    const { fileModel: _sFileModel, ...surgicalData } = (this.surgicalIntervention?.value) || {};
    const { fileModel: _fFileModel, ...followUpData } = (this.followUp?.value) || {};

    const apiPayload: any = {
      Patient: {
        ...patientData,
        FileModel: patientGroup?.get('fileModel')?.value || null,
      },
      Admission: {
        ...admissionData,
        FileModel: this.admission?.get('fileModel')?.value || null,
      },
      SurgicalIntervention: {
        ...surgicalData,
        FileModel: this.surgicalIntervention?.get('fileModel')?.value || null,
      },
      FollowUp: {
        ...followUpData,
        FileModel: this.followUp?.get('fileModel')?.value || null,
      }
    };

    if (this.isEditMode && this.patientId) {
      apiPayload.PatientId = this.patientId;
      apiPayload.Patient = { ...(apiPayload.Patient || {}), patientId: this.patientId };
    }

    const formData = new FormData();
    this.formService.buildFormData(formData, apiPayload);
    // Debug: log FormData keys to verify binding paths
    try {
      for (const [k, v] of (formData as any).entries()) {
        const isFile = typeof File !== 'undefined' && v instanceof File;
        console.log(k, isFile ? `File(${(v as File).name})` : v);
      }
    } catch {}
    this.BtnDisabled = true;
    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatientFull(formData).subscribe(() => {
        this.BtnDisabled = false;
        this.toastr.success('Patient updated successfully!', 'Success');
        if (this.isModal) {
          this.RefreshData.emit(true);
          this.modalService.dismissAll();
        } else {
          this.router.navigate(['/admin/patients']);
        }
      });
    } else {
      this.patientService.AddNewPatientFull(formData).subscribe(() => {
        this.BtnDisabled = false;
        this.toastr.success('Patient created successfully!', 'Success');
        if (this.isModal) {
          this.RefreshData.emit(true);
          this.modalService.dismissAll();
        } else {
          this.router.navigate(['/admin/patients']);
        }
      });
    }
  }
  
  toApiFileModel(model: UploadFileModel, actionType: ActionTypes) {
    const isFileBlob = (value: any): boolean => value instanceof File || value instanceof Blob;
    return {
      ActionId: (this.patientId ?? model.actionId) ?? 0,
      ActionType: actionType,
      InsertUser: this.authService.UserModel?.userName ?? this.authService.userId ?? '',
      Files: (model.files || []).map(f => ({
        AttachmentId: (f.attachmentId !== undefined && f.attachmentId !== null) ? Number(f.attachmentId) : null,
        ActionType: actionType,
        FileName: f.fileName ?? '',
        ExistFileName: f.existFileName ?? '',
        FileSize: f.fileSize ?? '',
        File: isFileBlob(f.file) ? f.file : null
      })),
      DeletedFiles: (model.deletedFiles || []).map(d => ({
        AttachmentId: Number(d.attachmentId ?? 0),
        FileName: d.fileName ?? ''
      }))
    };
  }
  

  navigateBack(): void {
    if (this.isModal) {
      this.modalService.dismissAll();
    } else {
      this.router.navigate(['/admin/patients']);
    }
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }


  

}
