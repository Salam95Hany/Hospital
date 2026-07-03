import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { PatientData } from '../../../models/patient.model';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminGeneralInputComponent } from '../../../shared/admin-general-input/admin-general-input.component';
import { AdminDropDownComponent } from '../../../shared/admin-drop-down/admin-drop-down.component';
import { ToastrService } from 'ngx-toastr';
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';
import { AdminService } from '../../../services/admin.service';
import { DoctorService } from '../../../services/doctor.service';
import { AdminSliderImageComponent } from '../../../shared/admin-slider-image/admin-slider-image.component';
import { AdminUploadFileComponent } from '../../../shared/admin-upload-file/admin-upload-file.component';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NgbModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AdmissionCreateComponent } from '../../admission/admission-create/admission-create.component';
import { SurgicalInterventionCreateComponent } from '../../surgicalIntervention/surgical-intervention-create/surgical-intervention-create.component';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,
    AdminGeneralInputComponent,
    AdminDropDownComponent, AdminSliderImageComponent, AdminUploadFileComponent, NgbDropdownModule],
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css'],
  providers: [DatePipe]
})
export class PatientCreateComponent implements OnInit, OnChanges {
  @ViewChild(AdmissionCreateComponent) admissionChild?: AdmissionCreateComponent;
  @ViewChild(SurgicalInterventionCreateComponent) surgicalChild?: SurgicalInterventionCreateComponent;
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

  // Doctors multi-select for Surgical step
  //DoctorsData: { id: string, name: string }[] = [];
  DoctorsData: { id: string, name: string, academicDegree: string }[] = [];
  MainSurgeonDoctors: { id: string, name: string, academicDegree: string }[] = [];
  AssistantDoctors: { id: string, name: string, academicDegree: string }[] = [];
  ResidentDoctors: { id: string, name: string, academicDegree: string }[] = [];
  SupervisorDoctors: { id: string, name: string, academicDegree: string }[] = [];

  SelectedMainSurgeon: { id: number, name: string }[] = [];
  SelectedAssistants: { id: number, name: string }[] = [];
  SelectedResident: { id: number, name: string }[] = [];
  SelectedSupervisor: { id: number, name: string }[] = [];

  // Bind to admin-drop-down to control displayed selection
  mainSurgeonSelectorValue: any = '';
  assistantSelectorValue: any = '';
  residentSelectorValue: any = '';
  supervisorSelectorValue: any = '';
  DoctorPagingFilter: { filterList: any[]; currentpage: number; pagesize: number } = {
    filterList: [],
    currentpage: 1,
    pagesize: 1000
  };
  // Urine Analysis custom control state
  selectedValue: any = 'Select Urine Analysis';
  selectedUrineName: string = '';
  UrineInputValue: string = '';
  // Read-only visibility flags
  hasAdmissionDetails: boolean = false;
  hasSurgicalDetails: boolean = false;
  steps = [
    { title: 'Patient Information', isCompleted: false },
    { title: 'Admission Details', isCompleted: false },
    { title: 'Surgical Intervention', isCompleted: false }
  ];
  governorates = [
    { id: 'Alexandria', name: 'Alexandria' },
    { id: 'Aswan', name: 'Aswan' },
    { id: 'Assiut', name: 'Assiut' },
    { id: 'Beheira', name: 'Beheira' },
    { id: 'Beni Suef', name: 'Beni Suef' },
    { id: 'Cairo', name: 'Cairo' },
    { id: 'Dakahlia', name: 'Dakahlia' },
    { id: 'Damietta', name: 'Damietta' },
    { id: 'Fayoum', name: 'Fayoum' },
    { id: 'Gharbia', name: 'Gharbia' },
    { id: 'Giza', name: 'Giza' },
    { id: 'Ismailia', name: 'Ismailia' },
    { id: 'Kafr El Sheikh', name: 'Kafr El Sheikh' },
    { id: 'Luxor', name: 'Luxor' },
    { id: 'Matrouh', name: 'Matrouh' },
    { id: 'Minya', name: 'Minya' },
    { id: 'Menofia', name: 'Menofia' },
    { id: 'New Valley', name: 'New Valley' },
    { id: 'North Sinai', name: 'North Sinai' },
    { id: 'Port Said', name: 'Port Said' },
    { id: 'Qalyubia', name: 'Qalyubia' },
    { id: 'Qena', name: 'Qena' },
    { id: 'Red Sea', name: 'Red Sea' },
    { id: 'Sharkia', name: 'Sharkia' },
    { id: 'Sohag', name: 'Sohag' },
    { id: 'South Sinai', name: 'South Sinai' },
    { id: 'Suez', name: 'Suez' }
  ];
  maritalStatuses = [
    { id: 'Single', name: 'Single' },
    { id: 'Married', name: 'Married' },
    { id: 'Divorced', name: 'Divorced' },
    { id: 'Widowed', name: 'Widowed' },
    { id: 'Child', name: 'Child' }
  ];
  @Input() patientId: number | null = null;
  isEditMode: boolean = false;
  @Input() isReadOnly: boolean = false;

  courses = [
    { id: 'Progressing', name: 'Progressing' },
    { id: 'Stationary', name: 'Stationary' },
    { id: 'Regressing', name: 'Regressing' },
    { id: 'On & off', name: 'On & off' }
  ];
  hospitalBranches = [
    { id: 'Al-Hussien', name: 'Al-Hussien' },
    { id: 'Saied Galal', name: 'Saied Galal' },
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
  theatres = [
    { id: 'A', name: 'A' },
    { id: 'B', name: 'B' },
    { id: 'C', name: 'C' },
    { id: 'Main', name: 'Main' },
    { id: 'Dpt', name: 'Dpt' },
    { id: 'US', name: 'US' }
  ];
  anaesthesias = [
    { id: 'General', name: 'General' },
    { id: 'Regional', name: 'Regional' },
    { id: 'Local', name: 'Local' }
  ];
  tubesFixed = [
    { id: 'Drain', name: 'Drain' },
    { id: 'Urethral catheter', name: 'Urethral catheter' },
    { id: 'S. Pubic catheter', name: 'S. Pubic catheter' },
    { id: 'Ureteric catheter', name: 'Ureteric catheter' },
    { id: 'Ureteric Stent', name: 'Ureteric Stent' },
    { id: 'Nephrostomy', name: 'Nephrostomy' },
    { id: 'Others', name: 'Others' }
  ];
  categories = [
    { id: 'Urolithiasis', name: 'Urolithiasis' },
    { id: 'Oncology', name: 'Oncology' },
    { id: 'LUTD', name: 'LUTD' },
    { id: 'Reconstructive', name: 'Reconstructive' },
    { id: 'Andrology', name: 'Andrology' },
    { id: 'Pediatric', name: 'Pediatric' }
  ];
  approaches = [
    { id: 'Endourology', name: 'Endourology' },
    { id: 'Open Surgery', name: 'Open Surgery' },
    { id: 'Laparoscopy', name: 'Laparoscopy' },
    { id: 'Microscopic', name: 'Microscopic' }
  ];
  organs = [
    { id: 'Adrenal', name: 'Adrenal' },
    { id: 'Kidney', name: 'Kidney' },
    { id: 'Ureter', name: 'Ureter' },
    { id: 'Bladder', name: 'Bladder' },
    { id: 'Prostate', name: 'Prostate' },
    { id: 'Urethra', name: 'Urethra' },
    { id: 'Penis', name: 'Penis' },
    { id: 'Scrotum/Testes', name: 'Scrotum/Testes' },
    { id: 'Others', name: 'Others' }
  ];
  intraOpCourses = [
    { id: 'Smooth', name: 'Smooth' },
    { id: 'Minor adv. Events', name: 'Minor adv. Events' },
    { id: 'Moderate adv. Events', name: 'Moderate adv. Events' },
    { id: 'Major dv. events', name: 'Major dv. events' }
  ];
  postOpCourses = [
    { id: 'Smooth', name: 'Smooth' },
    { id: 'Minor adv. Events', name: 'Minor adv. Events' },
    { id: 'Moderate adv. Events', name: 'Moderate adv. Events' },
    { id: 'Major dv. events', name: 'Major dv. events' }
  ];
  patientRemarks = [
    { id: 'Better', name: 'Better' },
    { id: 'Worse', name: 'Worse' },
    { id: 'The same', name: 'The same' },
    { id: 'Details', name: 'Details' }
  ];

  formErrors = {
    hospitalFileNumber: '',
    admissionDate: '',
    dischargeDate: '',
    course: '',
    interventionDate: '',
    theater: '',
    mainSurgeon: '',
    nationalId: '',
    phone1: '',
    phone2: '',
    name: '',
    age: '',
    gender: '',
    hospitalBranch: '',
    chiefComplaint: '',
    hPI: '',
    provisionalDiagnosis: '',
    intervention: '',
    interventionDetails: '',
    advice: '',
    doctorId: ''
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
    private modalService: NgbModal,
    private doctorService: DoctorService
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
    this.loadDoctors();
    this.setupFormValueChanges();
    this.setupHospitalFileNumberValidation();

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
        let hasConflict = false;
        if (Array.isArray(results) && results.length > 0) {
          if (this.patientId) {
            const currentPatientId = this.patientId;
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
        nationalId: ['', [Validators.pattern(/^\d{14}$/)]],
        address: null,
        governorate: [''],
        phone1: ['', [Validators.pattern(/^01\d{9}$/)]],
        phone2: ['', [Validators.pattern(/^01\d{9}$/)]],
        occupation: null,
        maritalStatus: [''],
        childrenCount: null,
        internalNumber: 1,
        archives: null,
        fileModel: null
      }),
      admission: this.createAdmissionFormGroup(),
      surgicalIntervention: this.createSurgicalInterventionFormGroup()
    });

    // Set actionId for file objects if patientId exists
    if (this.patientId) {
      this.patientFiles.actionId = this.patientId;
      this.admissionFiles.actionId = this.patientId;
      this.surgicalFiles.actionId = this.patientId;
    }

    // Disable all controls in read-only mode
    if (this.isReadOnly) {
      this.patientForm.disable({ emitEvent: false });
    }

    // Initialize Urine Analysis display from form value, if any
    const uVal = this.admission.get('urineAnalysis')?.value;
    this.applyUrineInitialValue(uVal);
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
    }

    // Also keep the SelectedFile for backward compatibility
    this.SelectedFile = selectedFile;
  }
  GetFilesByActionId() {
    // Load files for all steps
    const actionTypes = [
      ActionTypes.Patient,
      ActionTypes.Admission,
      ActionTypes.SurgicalIntervention
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
              mediaType: i.mediaType,
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

    const birthCtrl = this.patient.get('birthDate');
    if (birthCtrl) {
      birthCtrl.valueChanges.subscribe((val) => {
        const ageCtrl = this.patient.get('age');
        const computed = this.calculateAge(val);
        if (ageCtrl) {
          ageCtrl.setValue(computed, { emitEvent: false });
        }
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

        // Patient group
        this.patient.patchValue({
          name: pas.name ?? pas.Name ?? null,
          birthDate: this.datePipe.transform(pas.birthDate ?? pas.BirthDate, 'yyyy-MM-dd') ?? null,
          age: pas.age ?? pas.Age ?? null,
          gender: pas.gender ?? pas.Gender ?? null,
          nationalId: pas.nationalId ?? pas.NationalId ?? null,
          address: pas.address ?? pas.Address ?? null,
          phone1: (pas.phone1 ?? pas.Phone1) ?? null,
          phone2: (pas.phone2 ?? pas.Phone2) ?? null,
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
          course: adm.course ?? adm.Course ?? null,
          hPI: adm.hpi ?? adm.Hpi ?? null,
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
          urineAnalysis: adm.urineAnalysis ?? adm.UrineAnalysis ?? null,
          urinePusCells: adm.urinePusCells ?? adm.UrinePusCells ?? null,
          urineRBCs: adm.urineRBCs ?? adm.UrineRBCs ?? null,
          urineCrystals: adm.urineCrystals ?? adm.UrineCrystals ?? null,
          urineAlbumin: adm.urineAlbumin ?? adm.UrineAlbumin ?? null,
          urineSugar: adm.urineSugar ?? adm.UrineSugar ?? null,
          urineOthers: adm.urineOthers ?? adm.UrineOthers ?? null,
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

        this.patchRoleSelectionsFromLastSurgical(surg);

        // Fetch files for slider if available
        this.GetFilesByActionId();

        // Disable form if read-only
        if (this.isReadOnly) {
          this.patientForm.disable({ emitEvent: false });
        }

        // Initialize Urine Analysis display from loaded value
        const uVal = this.admission.get('urineAnalysis')?.value;
        this.applyUrineInitialValue(uVal);

        // Set visibility flags for read-only based on patched values
        const admVal = this.admission?.value;
        const surgVal = this.surgicalIntervention?.value;
        const folVal = this.followUp?.value;

        this.hasAdmissionDetails = this.hasAnyValue(admVal);
        this.hasSurgicalDetails = this.hasAnyValue(surgVal);
        //this.hasFollowUpDetails = this.hasAnyValue(folVal);
      },
      error: (err) => {
        // Non-blocking: leave form empty in case of error
        console.error('Failed to load last details', err);
      }
    });
  }

  // Urine Analysis helpers
  onSelectUrine(item: { id: number; name: string }) {
    this.selectedValue = item.id;
    this.selectedUrineName = item.name;
    this.UrineInputValue = '';
    this.updateUrineAnalysisControl();
  }

  onUrineValueChange(value: string) {
    this.UrineInputValue = value ?? '';
    this.updateUrineAnalysisControl();
  }

  getUrineDisplayText(): string {
    return this.selectedUrineName || (typeof this.selectedValue === 'string' ? this.selectedValue : '') || 'Select Urine Analysis';
  }

  private updateUrineAnalysisControl() {
    const name = this.selectedUrineName || '';
    const val = this.UrineInputValue?.trim();
    const combined = name ? (val ? `${name}: ${val}` : name) : null;
    this.admission.get('urineAnalysis')?.setValue(combined);
  }

  private applyUrineInitialValue(uVal: any) {
    const str = (uVal ?? '').toString();
    if (!str) {
      this.selectedValue = 'Select Urine Analysis';
      this.selectedUrineName = '';
      this.UrineInputValue = '';
      return;
    }
    const parts = str.split(':');
    const name = parts[0].trim();
    const extra = parts.slice(1).join(':').trim();
    const match = this.urineAnalyses.find(a => (a.name || '').toLowerCase() === name.toLowerCase());
    if (match) {
      this.selectedValue = match.id;
      this.selectedUrineName = match.name;
    } else {
      this.selectedValue = name || 'Select Urine Analysis';
      this.selectedUrineName = name;
    }
    this.UrineInputValue = extra || '';
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

  private calculateAge(dateValue: any): number | null {
    if (!dateValue) return null;
    let birth: Date;

    if (typeof dateValue === 'string') {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
        const [dd, mm, yyyy] = dateValue.split('/');
        birth = new Date(+yyyy, +mm - 1, +dd);
      } else {
        birth = new Date(dateValue);
      }
    } else {
      birth = new Date(dateValue);
    }

    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    const diffMs = today.getTime() - birth.getTime();
    const age = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 0 ? Number(age.toFixed(1)) : 0;
  }

  createAdmissionFormGroup(): FormGroup {
    return this.fb.group({
      hospitalFileNumber: ['', [Validators.required]],
      admissionDate: ['', [Validators.required]],
      dischargeDate: null,
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
      scheduledDate: null,
      fileModel: null
    });
  }

  createSurgicalInterventionFormGroup(): FormGroup {
    return this.fb.group({
      interventionDate: [null, [Validators.required]],
      theater: [null],
      mainSurgeon: [null, [Validators.required]],
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
    if (this.currentStep === 1) {
      if (!this.validateCurrentStep()) {
        this.showValidationErrors();
        return;
      }
    } else if (this.currentStep === 2) {
      const ok = this.integrateAdmissionFromChild();
      if (!ok) {
        return;
      }
    }
    if (this.currentStep < this.steps.length) {
      this.steps[this.currentStep - 1].isCompleted = true;
      this.currentStep++;
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
        this.formErrors[key] = this.getErrorMessage(control.errors, key);
      } else {
        delete this.formErrors[key];
      }
    });
  }

  getErrorMessage(errors: any, key: string = ''): string {
    if (errors.required) {
      return 'This field is required';
    }
    if (errors.pattern || errors.minlength || errors.maxlength) {
      if (key === 'phone1' || key === 'phone2') {
        return 'Must be 11 digits and start with 01';
      }
      return 'Must be 14 digits';
    }
    return '';
  }

  clearErrorsOnValidInput() {
    // Clear errors for the entire form when inputs become valid
    const formGroups = [
      this.patientForm.get('patient') as FormGroup,
      this.admission,
      this.surgicalIntervention
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
    const timeDiff = discharge.getTime() - admission.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    this.admission.get('duration').setValue(`${daysDiff} days`);
  }

  savePatient(): void {
    this.patientForm = this.formService.TrimFormInputValue(this.patientForm);
    this.markFormGroupTouched(this.patientForm.get('patient') as FormGroup);
    const patientGroup = this.patientForm.get('patient') as FormGroup;
    const patientValid = patientGroup.valid;
    if (!patientValid) {
      this.showValidationErrors();
      return;
    }
    const setModel = (group: FormGroup, model: UploadFileModel, actionType: ActionTypes) => {
      if ((model?.files?.length || 0) > 0 || (model?.deletedFiles?.length || 0) > 0) {
        group.get('fileModel').setValue(this.toApiFileModel(model, actionType));
      } else {
        group.get('fileModel').setValue(null);
      }
    };
    setModel(patientGroup, this.patientFiles, ActionTypes.Patient);
    const { fileModel: _pFileModel, ...patientData } = (patientGroup?.value) || {};
    const apiPayload: any = {
      Patient: {
        ...patientData,
        InsertUser: this.authService.userId ?? this.authService.UserModel?.userName ?? '',
        FileModel: patientGroup?.get('fileModel')?.value || null,
      }
    };
    if (this.isEditMode && this.patientId) {
      apiPayload.PatientId = this.patientId;
      apiPayload.Patient = { ...(apiPayload.Patient || {}), patientId: this.patientId };
    }
    const formData = new FormData();
    this.formService.buildFormData(formData, apiPayload);
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

  private integrateAdmissionFromChild(): boolean {
    if (!this.admissionChild) {
      return this.validateCurrentStep();
    }
    const childForm = this.admissionChild.GetOutputData();
    if (!childForm) {
      return false;
    }
    this.admission.patchValue(childForm.value || {});
    if (this.admissionChild.SelectedFile) {
      this.admissionFiles = this.admissionChild.SelectedFile;
    }
    return true;
  }

  private integrateSurgicalFromChild(): void {
    if (!this.surgicalChild) {
      return;
    }
    const childForm = this.surgicalChild.GetOutputData();
    if (!childForm) {
      return;
    }
    this.surgicalIntervention.patchValue(childForm.value || {});
    if (this.surgicalChild.SelectedFile) {
      this.surgicalFiles = this.surgicalChild.SelectedFile;
    }
    // this.SelectedMainSurgeon = (this.surgicalChild.SelectedMainSurgeon || []).map(d => ({ id: d.id, name: d.name }));
    // this.SelectedAssistants = (this.surgicalChild.SelectedAssistants || []).map(d => ({ id: d.id, name: d.name }));
    // this.SelectedResident = (this.surgicalChild.SelectedResident || []).map(d => ({ id: d.id, name: d.name }));
    // this.SelectedSupervisor = (this.surgicalChild.SelectedSupervisor || []).map(d => ({ id: d.id, name: d.name }));
  }

  toApiFileModel(model: UploadFileModel, actionType: ActionTypes) {
    const isFileBlob = (value: any): boolean => value instanceof File || value instanceof Blob;
    return {
      ActionId: (this.patientId ?? model.actionId) ?? 0,
      ActionType: actionType,
      InsertUser: this.authService.userId ?? this.authService.UserModel?.userName ?? '',
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

  // Role-based doctor selection handlers
  OnMainSurgeonChange(doctorId: string) {
    const doc = this.MainSurgeonDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedMainSurgeon.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedMainSurgeon.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedMainSurgeon.map(a => a.id).join(',');
      this.surgicalIntervention.patchValue({ mainSurgeon: idsCsv });
    }
  }

  OnAssistantChange(doctorId: string) {
    const doc = this.AssistantDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedAssistants.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedAssistants.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedAssistants.map(a => a.id).join(',');
      this.surgicalIntervention.patchValue({ assistants: idsCsv });
    }
  }

  RemoveSelectedAssistant(doctorId: number) {
    this.SelectedAssistants = this.SelectedAssistants.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedAssistants.map(a => a.id).join(',');
    this.surgicalIntervention.patchValue({ assistants: idsCsv || null });
    // Clear dropdown display selection
    this.assistantSelectorValue = '';
  }

  OnResidentChange(doctorId: string) {
    const doc = this.ResidentDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedResident.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedResident.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedResident.map(a => a.id).join(',');
      this.surgicalIntervention.patchValue({ resident: idsCsv });
    }
  }

  OnSupervisorChange(doctorId: string) {
    const doc = this.SupervisorDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedSupervisor.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedSupervisor.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedSupervisor.map(a => a.id).join(',');
      this.surgicalIntervention.patchValue({ offFieldSupervisor: idsCsv });
    }
  }

  RemoveSelectedMainSurgeon(doctorId: number) {
    this.SelectedMainSurgeon = this.SelectedMainSurgeon.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedMainSurgeon.map(a => a.id).join(',');
    this.surgicalIntervention.patchValue({ mainSurgeon: idsCsv || null });
    // Clear dropdown display selection
    this.mainSurgeonSelectorValue = '';
  }

  RemoveSelectedResident(doctorId: number) {
    this.SelectedResident = this.SelectedResident.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedResident.map(a => a.id).join(',');
    this.surgicalIntervention.patchValue({ resident: idsCsv || null });
    // Clear dropdown display selection
    this.residentSelectorValue = '';
  }

  RemoveSelectedSupervisor(doctorId: number) {
    this.SelectedSupervisor = this.SelectedSupervisor.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedSupervisor.map(a => a.id).join(',');
    this.surgicalIntervention.patchValue({ offFieldSupervisor: idsCsv || null });
    // Clear dropdown display selection
    this.supervisorSelectorValue = '';
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

  private loadDoctors(): void {
    this.doctorService.GetAllDoctorData(this.DoctorPagingFilter).subscribe(res => {
      const all = (res?.results || []).map((i: any) => ({ id: i.doctorId?.toString(), name: i.doctorName, academicDegree: (i.academicDegree || '').toString() }));
      this.DoctorsData = all;
      this.MainSurgeonDoctors = all.filter(d => this.roleMatches('main surgeon', d.academicDegree));
      this.AssistantDoctors = all.filter(d => this.roleMatches('assistants', d.academicDegree));
      this.ResidentDoctors = all.filter(d => this.roleMatches('resident', d.academicDegree));
      this.SupervisorDoctors = all.filter(d => this.roleMatches('supervisor', d.academicDegree) || this.roleMatches('off-field supervisor', d.academicDegree));
      if (this.MainSurgeonDoctors.length === 0) this.MainSurgeonDoctors = all;
      if (this.AssistantDoctors.length === 0) this.AssistantDoctors = all;
      if (this.ResidentDoctors.length === 0) this.ResidentDoctors = all;
      if (this.SupervisorDoctors.length === 0) this.SupervisorDoctors = all;
      this.populateSelectionsFromFormCsv();
    });
  }

  private roleMatches(targetRole: string, actual: string): boolean {
    const t = (targetRole || '').toLowerCase().trim();
    const a = (actual || '').toLowerCase().trim();
    if (!a) return false;
    switch (t) {
      case 'main surgeon':
        return a === 'main surgeon' || (a.includes('main') && a.includes('surgeon'));
      case 'assistants':
        return a === 'assistants' || a === 'assistant' || a.includes('assistant');
      case 'resident':
        return a === 'resident' || a.includes('resident');
      case 'supervisor':
      case 'off-field supervisor':
        return a === 'off-field supervisor' || a === 'off field supervisor' || a === 'supervisor' || a.includes('supervisor');
      default:
        return a.includes(t);
    }
  }

  private patchRoleSelectionsFromLastSurgical(surg: any): void {
    const extract = (arr: any[] | undefined): { id: number, name: string }[] => {
      const list = Array.isArray(arr) ? arr : [];
      return list
        .map(d => ({ id: Number(d?.DoctorId ?? d?.doctorId ?? 0), name: (d?.DoctorName ?? d?.doctorName ?? '').toString() }))
        .filter(d => !!d.id && !!d.name);
    };
    const main = extract(surg?.MainSurgeonDetails ?? surg?.mainSurgeonDetails);
    const assist = extract(surg?.AssistantsDetails ?? surg?.assistantsDetails);
    const resid = extract(surg?.ResidentDetails ?? surg?.residentDetails);
    const supervis = extract(surg?.OffFieldSupervisorDetails ?? surg?.offFieldSupervisorDetails);
    this.SelectedMainSurgeon = main.length ? main : [];
    this.SelectedAssistants = assist.length ? assist : [];
    this.SelectedResident = resid.length ? resid : [];
    this.SelectedSupervisor = supervis.length ? supervis : [];
    if (!main.length || !assist.length || !resid.length || !supervis.length) {
      this.populateSelectionsFromFormCsv();
    }
  }

  private populateSelectionsFromFormCsv(): void {
    const mapCsv = (csv: string | null | undefined): { id: number, name: string }[] => {
      const raw = (csv ?? '').toString();
      if (!raw.trim()) return [];
      const ids = raw.split(',').map(s => s.trim()).filter(Boolean);
      return ids.map(idStr => {
        const doc = this.DoctorsData.find(d => d.id === idStr);
        const id = Number(idStr);
        return { id, name: doc?.name ?? '' };
      }).filter(d => !!d.id);
    };
    if (this.SelectedMainSurgeon.length === 0) {
      this.SelectedMainSurgeon = mapCsv(this.surgicalIntervention.get('mainSurgeon')?.value);
    }
    if (this.SelectedAssistants.length === 0) {
      this.SelectedAssistants = mapCsv(this.surgicalIntervention.get('assistants')?.value);
    }
    if (this.SelectedResident.length === 0) {
      this.SelectedResident = mapCsv(this.surgicalIntervention.get('resident')?.value);
    }
    if (this.SelectedSupervisor.length === 0) {
      this.SelectedSupervisor = mapCsv(this.surgicalIntervention.get('offFieldSupervisor')?.value);
    }
  }
}

