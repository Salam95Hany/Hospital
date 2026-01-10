import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUploadFileComponent } from "../../../shared/admin-upload-file/admin-upload-file.component";
import { AdminSliderImageComponent } from "../../../shared/admin-slider-image/admin-slider-image.component";
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';

@Component({
  selector: 'app-surgical-intervention-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, FormsModule, AdminUploadFileComponent, AdminSliderImageComponent, NgFor, NgIf,
    NgClass
  ],
  templateUrl: './surgical-intervention-create.component.html',
  styleUrl: './surgical-intervention-create.component.css',
  providers: [DatePipe]
})
export class SurgicalInterventionCreateComponent {
  @Input() AdmissionId: any;
  @Input() SurgicalInterventionId: any;
  @Input() DetailsMode = false;
  @Input() PatientMode = false;
  @Input() DoctorsData: { id: string, name: string, academicDegree: string }[] = [];
  @Output() RefreshData = new EventEmitter<boolean>();
  MainSurgeonDoctors: { id: string, name: string }[] = [];
  AssistantDoctors: { id: string, name: string }[] = [];
  ResidentDoctors: { id: string, name: string }[] = [];
  SupervisorDoctors: { id: string, name: string }[] = [];

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

  SelectedFile: UploadFileModel;
  ImportedFiles: FilesModel[] = [];
  SelectedMainSurgeon: { id: number, name: string }[] = [];
  SelectedAssistants: { id: number, name: string }[] = [];
  SelectedResident: { id: number, name: string }[] = [];
  SelectedSupervisor: { id: number, name: string }[] = [];
  mainSurgeonSelectorValue: any = '';
  assistantSelectorValue: any = '';
  residentSelectorValue: any = '';
  supervisorSelectorValue: any = '';
  UserId: any;
  BtnDisabled = false;
  ItemForm: FormGroup;
  formErrors = {
    interventionDate: '',
    theater: '',
    postOpDay0_1: '',
    postOpDay2_5: '',
    postOpDayOver5: '',
    dischargeInstructions: '',
    followUpDoctor: '',
    followUpDoctorPhone: '',
    followUpAppointment: ''
  };



  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
    this.assignRoleLists();
    const dischargeCtrl = this.ItemForm.get('dischargeDate');
    if (dischargeCtrl) {
      this.updateValidatorsBasedOnDischarge();
      dischargeCtrl.valueChanges.subscribe(() => {
        this.updateValidatorsBasedOnDischarge();
      });
    }

    if (this.SurgicalInterventionId) {
      this.GetSurgicalInterventionById();
      this.GetFilesByActionId();
    }
    if (this.DetailsMode) {
      this.ItemForm.disable();
    }
  }

  ngOnChanges(): void {
    this.assignRoleLists();
  }



  FormInit() {
    this.ItemForm = this.fb.group({
      surgicalInterventionId: 0,
      admissionId: 0,
      interventionDate: [null, [Validators.required]],
      theater: [null, [Validators.required]],
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
      fileModel: null,
      insertUser: null
    });

    this.ItemForm.valueChanges.subscribe(() => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  /**
   * Toggle required validators for specific fields when a discharge date is selected.
   * Mirrors PatientCreate behavior: selecting discharge date makes post-op and follow-up fields mandatory.
   */
  private updateValidatorsBasedOnDischarge(): void {
    const fieldsToToggle = [
      'postOpDay0_1',
      'postOpDay2_5',
      'postOpDayOver5',
      'dischargeInstructions',
      'followUpDoctor',
      'followUpDoctorPhone',
      'followUpAppointment'
    ];

    const dischargeSelected = !!this.ItemForm.get('dischargeDate')?.value;

    fieldsToToggle.forEach(key => {
      const ctrl = this.ItemForm.get(key);
      if (!ctrl) return;
      if (dischargeSelected) {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.clearValidators();
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  FillEditForm(item: any) {
    this.SelectedMainSurgeon = [];
    this.SelectedAssistants = [];
    this.SelectedResident = [];
    this.SelectedSupervisor = [];
    const mapCsv = (csv: string | null | undefined): { id: number, name: string }[] => {
      const raw = (csv ?? '').toString();
      if (!raw.trim()) return [];
      const ids = raw.split(',').map(s => s.trim()).filter(Boolean);
      return ids.map(idStr => {
        const doc = this.DoctorsData.find(d => d.id == idStr);
        const id = Number(idStr);
        return { id, name: doc?.name ?? '' };
      }).filter(d => !!d.id);
    };
    const extract = (arr: any[] | undefined): { id: number, name: string }[] => {
      const list = Array.isArray(arr) ? arr : [];
      return list
        .map(d => ({ id: Number(d?.doctorId ?? d?.DoctorId ?? 0), name: (d?.doctorName ?? d?.DoctorName ?? '').toString() }))
        .filter(d => !!d.id && !!d.name);
    };
    const ms = extract(item?.mainSurgeonDetails ?? item?.MainSurgeonDetails);
    const asst = extract(item?.assistantsDetails ?? item?.AssistantsDetails);
    const resi = extract(item?.residentDetails ?? item?.ResidentDetails);
    const sup = extract(item?.offFieldSupervisorDetails ?? item?.OffFieldSupervisorDetails);
    this.SelectedMainSurgeon = ms.length ? ms : mapCsv(item.mainSurgeon);
    this.SelectedAssistants = asst.length ? asst : mapCsv(item.assistants);
    this.SelectedResident = resi.length ? resi : mapCsv(item.resident);
    this.SelectedSupervisor = sup.length ? sup : mapCsv(item.offFieldSupervisor);
    this.ItemForm.patchValue({
      surgicalInterventionId: item.surgicalInterventionId ?? 0,
      admissionId: item.admissionId ?? null,
      interventionDate: this.datePipe.transform(item.interventionDate, 'yyyy-MM-dd') ?? '',
      theater: item.theater ?? null,
      mainSurgeon: (this.SelectedMainSurgeon.map(a => a.id).join(',')) || (item.mainSurgeon ?? null),
      assistants: (this.SelectedAssistants.map(a => a.id).join(',')) || (item.assistants ?? null),
      resident: (this.SelectedResident.map(a => a.id).join(',')) || (item.resident ?? null),
      otherSurgeons: item.otherSurgeons ?? null,
      offFieldSupervisor: (this.SelectedSupervisor.map(a => a.id).join(',')) || (item.offFieldSupervisor ?? null),
      anesthesia: item.anesthesia ?? null,
      intervention: item.intervention ?? null,
      interventionDetails: item.interventionDetails ?? null,
      tubesFixed: item.tubesFixed ?? null,
      category: item.category ?? null,
      approach: item.approach ?? null,
      organ: item.organ ?? null,
      intraOperativeCourse: item.intraOperativeCourse ?? null,
      intraOpAdverseEvents: item.intraOpAdverseEvents ?? null,
      bloodTransfusionUnits: item.bloodTransfusionUnits ?? null,
      postOpRecommendations: item.postOpRecommendations ?? null,
      postOpDay0_1: item.postOpDay0_1 ?? null,
      postOpDay2_5: item.postOpDay2_5 ?? null,
      postOpDayOver5: item.postOpDayOver5 ?? null,
      postOpAdverseEvents: item.postOpAdverseEvents ?? null,
      dischargeDate: this.datePipe.transform(item.dischargeDate, 'yyyy-MM-dd') ?? '',
      finalDiagnosis: item.finalDiagnosis ?? null,
      dischargeInstructions: item.dischargeInstructions ?? null,
      followUpDoctor: item.followUpDoctor ?? null,
      followUpDoctorPhone: item.followUpDoctorPhone ?? null,
      followUpAppointment: this.datePipe.transform(item.followUpAppointment, 'yyyy-MM-dd') ?? '',
      fileModel: null,
      insertUser: null
    });
  }

  GetSurgicalInterventionById() {
    this.adminService.GetSurgicalInterventionById(this.SurgicalInterventionId).subscribe(res => {
      if (res.results)
        this.FillEditForm(res.results);
    })
  }

  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.SurgicalInterventionId, ActionTypes.SurgicalIntervention).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.SurgicalIntervention,
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

  DismissModal() {
    this.modalService.dismissAll();
  }

  OnFileChange(selectedFile: UploadFileModel) {
    this.SelectedFile = selectedFile;
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

    if (this.SurgicalInterventionId)
      this.ItemForm.patchValue({ surgicalInterventionId: this.SurgicalInterventionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });
    const mainIds = this.SelectedMainSurgeon.map(a => a.id).join(',');
    const assistantsIds = this.SelectedAssistants.map(a => a.id).join(',');
    const residentIds = this.SelectedResident.map(a => a.id).join(',');
    const supervisorIds = this.SelectedSupervisor.map(a => a.id).join(',');
    this.ItemForm.patchValue({ mainSurgeon: mainIds || null });
    this.ItemForm.patchValue({ assistants: assistantsIds || null });
    this.ItemForm.patchValue({ resident: residentIds || null });
    this.ItemForm.patchValue({ offFieldSupervisor: supervisorIds || null });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }


    const formData = new FormData();
    this.formService.buildFormData(formData, this.ItemForm.value);
    this.BtnDisabled = true;
    if (!this.SurgicalInterventionId) {
      this.adminService.AddNewSurgicalIntervention(formData).subscribe(data => {
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
      this.adminService.UpdateSurgicalIntervention(formData).subscribe(data => {
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


  OnMainSurgeonChange(doctorId: string) {
    const doc = this.MainSurgeonDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedMainSurgeon.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedMainSurgeon.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedMainSurgeon.map(a => a.id).join(',');
      this.ItemForm.patchValue({ mainSurgeon: idsCsv });
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
      this.ItemForm.patchValue({ assistants: idsCsv });
    }
  }

  OnResidentChange(doctorId: string) {
    const doc = this.ResidentDoctors.find(i => i.id == doctorId);
    if (doc) {
      const exists = this.SelectedResident.find(i => i.id == +doctorId);
      if (!exists) {
        this.SelectedResident.push({ id: +doc.id, name: doc.name });
      }
      const idsCsv = this.SelectedResident.map(a => a.id).join(',');
      this.ItemForm.patchValue({ resident: idsCsv });
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
      this.ItemForm.patchValue({ offFieldSupervisor: idsCsv });
    }
  }

  RemoveSelectedMainSurgeon(doctorId: number) {
    this.SelectedMainSurgeon = this.SelectedMainSurgeon.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedMainSurgeon.map(a => a.id).join(',');
    this.ItemForm.patchValue({ mainSurgeon: idsCsv || null });
    this.mainSurgeonSelectorValue = '';
  }

  RemoveSelectedAssistant(doctorId: number) {
    this.SelectedAssistants = this.SelectedAssistants.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedAssistants.map(a => a.id).join(',');
    this.ItemForm.patchValue({ assistants: idsCsv || null });
    this.assistantSelectorValue = '';
  }

  RemoveSelectedResident(doctorId: number) {
    this.SelectedResident = this.SelectedResident.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedResident.map(a => a.id).join(',');
    this.ItemForm.patchValue({ resident: idsCsv || null });
    this.residentSelectorValue = '';
  }

  RemoveSelectedSupervisor(doctorId: number) {
    this.SelectedSupervisor = this.SelectedSupervisor.filter(i => i.id != doctorId);
    const idsCsv = this.SelectedSupervisor.map(a => a.id).join(',');
    this.ItemForm.patchValue({ offFieldSupervisor: idsCsv || null });
    this.supervisorSelectorValue = '';
  }

  private assignRoleLists(): void {
    const all = this.DoctorsData.map(d => ({ id: d.id, name: d.name, academicDegree: (d.academicDegree || '').toString() }));
    let ms = all.filter(d => this.roleMatches('main surgeon', d.academicDegree)).map(d => ({ id: d.id, name: d.name }));
    let asst = all.filter(d => this.roleMatches('assistants', d.academicDegree)).map(d => ({ id: d.id, name: d.name }));
    let resi = all.filter(d => this.roleMatches('resident', d.academicDegree)).map(d => ({ id: d.id, name: d.name }));
    let sup = all.filter(d => this.roleMatches('supervisor', d.academicDegree) || this.roleMatches('off-field supervisor', d.academicDegree)).map(d => ({ id: d.id, name: d.name }));
    if (ms.length === 0) ms = all.map(d => ({ id: d.id, name: d.name }));
    if (asst.length === 0) asst = all.map(d => ({ id: d.id, name: d.name }));
    if (resi.length === 0) resi = all.map(d => ({ id: d.id, name: d.name }));
    if (sup.length === 0) sup = all.map(d => ({ id: d.id, name: d.name }));
    this.MainSurgeonDoctors = ms;
    this.AssistantDoctors = asst;
    this.ResidentDoctors = resi;
    this.SupervisorDoctors = sup;
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

  GetOutputData(): FormGroup<any> {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return null;

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.SurgicalInterventionId)
      this.ItemForm.patchValue({ surgicalInterventionId: this.SurgicalInterventionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });
    const mainIds = this.SelectedMainSurgeon.map(a => a.id).join(',');
    const assistantsIds = this.SelectedAssistants.map(a => a.id).join(',');
    const residentIds = this.SelectedResident.map(a => a.id).join(',');
    const supervisorIds = this.SelectedSupervisor.map(a => a.id).join(',');
    this.ItemForm.patchValue({ mainSurgeon: mainIds || null });
    this.ItemForm.patchValue({ assistants: assistantsIds || null });
    this.ItemForm.patchValue({ resident: residentIds || null });
    this.ItemForm.patchValue({ offFieldSupervisor: supervisorIds || null });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }

    return this.ItemForm;
  }
}
