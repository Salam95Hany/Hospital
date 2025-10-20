import { Component } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";

@Component({
  selector: 'app-followup-create',
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminBreadcrumbComponent],
  templateUrl: './followup-create.component.html',
  styleUrl: './followup-create.component.css'
})
export class FollowupCreateComponent {
  patientRemarks = [
    { id: 1, name: 'Better' },
    { id: 2, name: 'Worse' },
    { id: 3, name: 'The same' },
    { id: 4, name: 'Details' }
  ];

  UserId: any;
  ItemForm: FormGroup;
  formErrors = {
    followUpDate: '',
    patientRemarksStatus: ''
  };


  constructor(private patientService: PatientService, private formService: FormService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
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
      followUpDate: item.followUpDate ? new Date(item.followUpDate) : null,
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
      nextFollowUpDate: item.nextFollowUpDate ? new Date(item.nextFollowUpDate) : null
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

    if (this.ItemForm.controls['id'].value == 0) {
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
