import { Component } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { CustomValidators, RegexType } from '../../../services/custom-validators';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";

@Component({
  selector: 'app-surgical-intervention-create',
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminBreadcrumbComponent],
  templateUrl: './surgical-intervention-create.component.html',
  styleUrl: './surgical-intervention-create.component.css'
})
export class SurgicalInterventionCreateComponent {
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

  UserId: any;
  ItemForm: FormGroup;
  formErrors = {
    interventionDate: '',
    theater: ''
  };


  constructor(private patientService: PatientService, private formService: FormService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.UserId = this.authService.userId;
    this.FormInit();
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
    });

    this.ItemForm.valueChanges.subscribe(() => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
    });
  }

  FillEditForm(item: any) {
    this.ItemForm.patchValue({
      surgicalInterventionId: item.surgicalInterventionId ?? 0,
      admissionId: item.admissionId ?? null,
      interventionDate: item.interventionDate ? new Date(item.interventionDate) : null,
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
      dischargeDate: item.dischargeDate ? new Date(item.dischargeDate) : null,
      finalDiagnosis: item.finalDiagnosis ?? null,
      dischargeInstructions: item.dischargeInstructions ?? null,
      followUpDoctor: item.followUpDoctor ?? null,
      followUpDoctorPhone: item.followUpDoctorPhone ?? null,
      followUpAppointment: item.followUpAppointment ? new Date(item.followUpAppointment) : null,
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
