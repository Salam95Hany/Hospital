import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUploadFileComponent } from "../../../shared/admin-upload-file/admin-upload-file.component";
import { AdminSliderImageComponent } from "../../../shared/admin-slider-image/admin-slider-image.component";
import { ActionTypes, FilesModel, UploadFileModel } from '../../../models/UploadFileModel';

@Component({
  selector: 'app-followup-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminUploadFileComponent, AdminSliderImageComponent, NgIf,NgClass],
  templateUrl: './followup-create.component.html',
  styleUrl: './followup-create.component.css',
  providers: [DatePipe]
})
export class FollowupCreateComponent {
  @Input() FollowUpId: any;
  @Input() AdmissionId: any;
  @Input() DetailsMode = false;
  @Input() PatientMode = false;
  @Output() RefreshData = new EventEmitter<boolean>();

  patientRemarks = [
    { id: 'Better', name: 'Better' },
    { id: 'Worse', name: 'Worse' },
    { id: 'The same', name: 'The same' },
    { id: 'Details', name: 'Details' }
  ];
  SelectedFile: UploadFileModel;
  ImportedFiles: FilesModel[] = [];
  UserId: any;
  ItemForm: FormGroup;
  BtnDisabled = false;
  formErrors = {
    followUpDate: '',
    patientRemarksStatus: ''
  };


  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
    if (this.FollowUpId) {
      this.GetFollowUpById();
      this.GetFilesByActionId();
    }
    if (this.DetailsMode) {
      this.ItemForm.disable();
    }
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      followUpId: 0,
      admissionId: 0,
      followUpDate: [null, [Validators.required]],
      patientRemarksStatus: [null, [Validators.required]],
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
      fileModel: null,
      insertUser: null
    });

    this.ItemForm.valueChanges.subscribe(() => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.patchValue({
      followUpId: item.followUpId ?? 0,
      surgicalInterventionId: item.surgicalInterventionId ?? 0,
      followUpDate: this.datePipe.transform(item.followUpDate, 'yyyy-MM-dd') ?? '',
      patientRemarksStatus: item.patientRemarksStatus ?? null,
      patientRemarksDetails: item.patientRemarksDetails ?? null,
      examinationFindings: item.examinationFindings ?? null,
      woundStatus: item.woundStatus ?? null,
      catheters: item.catheters ?? null,
      labResults: item.labResults ?? null,
      imagingResults: item.imagingResults ?? null,
      imagePath: item.imagePath ?? null,
      advice: item.advice ?? null,
      newDecision: item.newDecision ?? null,
      nextFollowUpDate: this.datePipe.transform(item.nextFollowUpDate, 'yyyy-MM-dd') ?? '',
      fileModel: null,
      insertUser: null
    });
  }

  GetFollowUpById() {
    this.adminService.GetFollowUpById(this.FollowUpId).subscribe(res => {
      if (res.results)
        this.FillEditForm(res.results);
    })
  }

  GetFilesByActionId() {
    this.adminService.GetFilesByActionId(this.FollowUpId, ActionTypes.FollowUp).subscribe(res => {
      if (res.results) {
        this.ImportedFiles = res.results.map<FilesModel>(i => {
          return {
            attachmentId: i.attachmentId,
            actionType: ActionTypes.FollowUp,
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

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }


    const formData = new FormData();
    this.formService.buildFormData(formData, this.ItemForm.value);
    this.BtnDisabled = true;
    if (!this.FollowUpId) {
      this.adminService.AddNewFollowUp(formData).subscribe(data => {
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
      this.adminService.UpdateFollowUp(formData).subscribe(data => {
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

  GetOutputData(): FormGroup<any> {
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return null;

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.SelectedFile?.files?.length > 0 || this.SelectedFile?.deletedFiles?.length > 0) {
      this.ItemForm.patchValue({ fileModel: this.SelectedFile });
    }

    return this.ItemForm;
  }
}
