import { Component, Input } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-followup-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule],
  templateUrl: './followup-create.component.html',
  styleUrl: './followup-create.component.css',
  providers: [DatePipe]
})
export class FollowupCreateComponent {
  @Input() FollowUpId: any;
  @Input() SurgicalInterventionId: any;

  patientRemarks = [
    { id: 'Better', name: 'Better' },
    { id: 'Worse', name: 'Worse' },
    { id: 'The same', name: 'The same' },
    { id: 'Details', name: 'Details' }
  ];

  UserId: any;
  ItemForm: FormGroup;
  formErrors = {
    followUpDate: '',
    patientRemarksStatus: ''
  };


  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private toaster: ToastrService, private datePipe: DatePipe, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
    if (this.FollowUpId)
      this.GetFollowUpById();
  }

  FormInit() {
    this.ItemForm = this.fb.group({
      followUpId: 0,
      surgicalInterventionId: 0,
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
      nextFollowUpDate: [null]
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
      nextFollowUpDate: this.datePipe.transform(item.nextFollowUpDate, 'yyyy-MM-dd') ?? ''
    });
  }

  GetFollowUpById() {
    this.adminService.GetFollowUpById(this.FollowUpId).subscribe(res => {
      if (res.results)
        this.FillEditForm(res.results);
    })
  }

  DismissModal() {
    this.modalService.dismissAll();
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

    if (this.SurgicalInterventionId)
      this.ItemForm.patchValue({ surgicalInterventionId: this.SurgicalInterventionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (!this.FollowUpId) {
      this.adminService.AddNewFollowUp(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.adminService.UpdateFollowUp(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.modalService.dismissAll();
        }
        else
          this.toaster.error(data.message);
      });
    }
  }
}
