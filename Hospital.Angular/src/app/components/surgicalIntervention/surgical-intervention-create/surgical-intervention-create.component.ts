import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUploadFileComponent } from "../../../shared/admin-upload-file/admin-upload-file.component";
import { AdminSliderImageComponent } from "../../../shared/admin-slider-image/admin-slider-image.component";
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';

@Component({
  selector: 'app-surgical-intervention-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminUploadFileComponent, AdminSliderImageComponent],
  templateUrl: './surgical-intervention-create.component.html',
  styleUrl: './surgical-intervention-create.component.css',
  providers: [DatePipe]
})
export class SurgicalInterventionCreateComponent {
  @Input() AdmissionId: any;
  @Input() SurgicalInterventionId: any;
  @Output() RefreshData = new EventEmitter<boolean>();

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
  UserId: any;
  BtnDisabled = false;
  ItemForm: FormGroup;
  formErrors = {
    interventionDate: '',
    theater: '',
    // Ensure errors can surface for dynamically-required fields when discharge date is set
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
    // Initialize discharge-date driven validators and subscribe to changes
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
      fileModel: null
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
    this.ItemForm.patchValue({
      surgicalInterventionId: item.surgicalInterventionId ?? 0,
      admissionId: item.admissionId ?? null,
      interventionDate: this.datePipe.transform(item.interventionDate, 'yyyy-MM-dd') ?? '',
      theater: item.theater ?? null,
      mainSurgeon: item.mainSurgeon ?? null,
      assistants: item.assistants ?? null,
      resident: item.resident ?? null,
      otherSurgeons: item.otherSurgeons ?? null,
      offFieldSupervisor: item.offFieldSupervisor ?? null,
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
      fileModel: null
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
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return;

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.SurgicalInterventionId)
      this.ItemForm.patchValue({ surgicalInterventionId: this.SurgicalInterventionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

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
}
