import { Component } from '@angular/core';
import { AdminGeneralInputComponent } from "../../../shared/admin-general-input/admin-general-input.component";
import { AdminDropDownComponent } from "../../../shared/admin-drop-down/admin-drop-down.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';
import { AuthService } from '../../../auth/auth.service';
import { AdminBreadcrumbComponent } from "../../../shared/admin-breadcrumb/admin-breadcrumb.component";
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-surgical-intervention-create',
  standalone: true,
  imports: [AdminGeneralInputComponent, AdminDropDownComponent, ReactiveFormsModule, AdminBreadcrumbComponent],
  templateUrl: './surgical-intervention-create.component.html',
  styleUrl: './surgical-intervention-create.component.css',
  providers: [DatePipe]
})
export class SurgicalInterventionCreateComponent {
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

  UserId: any;
  ItemForm: FormGroup;
  AdmissionId: any;
  SurgicalInterventionId: any;
  formErrors = {
    interventionDate: '',
    theater: ''
  };


  constructor(private adminService: AdminService, private formService: FormService, private fb: FormBuilder, private authService: AuthService,
    private route: ActivatedRoute, private toaster: ToastrService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.AdmissionId = this.route.snapshot.queryParamMap.get('admissionId');
    this.SurgicalInterventionId = this.route.snapshot.queryParamMap.get('surgicalInterventionId');
    this.UserId = this.authService.userId;
    this.FormInit();
    if (this.SurgicalInterventionId)
      this.GetSurgicalInterventionById();

    if (!this.AdmissionId && !this.SurgicalInterventionId) {
      this.toaster.warning('Please select admission first');
      this.router.navigateByUrl('/surgical-intervention');
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
    });

    this.ItemForm.valueChanges.subscribe(() => {
      this.formErrors = this.formService.validateForm(this.ItemForm, this.formErrors, true);
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
    });
  }

  GetSurgicalInterventionById() {
    this.adminService.GetSurgicalInterventionById(this.SurgicalInterventionId).subscribe(res => {
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
    this.ItemForm = this.formService.TrimFormInputValue(this.ItemForm);
    let isValid = this.validateForm();
    if (!isValid)
      return;

    if (this.AdmissionId)
      this.ItemForm.patchValue({ admissionId: this.AdmissionId });

    if (this.SurgicalInterventionId)
      this.ItemForm.patchValue({ surgicalInterventionId: this.SurgicalInterventionId });

    this.ItemForm.patchValue({ insertUser: this.UserId });

    if (this.AdmissionId) {
      this.adminService.AddNewSurgicalIntervention(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.router.navigateByUrl('/surgical-intervention');
        }
        else
          this.toaster.error(data.message);
      });
    } else {
      this.adminService.UpdateSurgicalIntervention(this.ItemForm.value).subscribe(data => {
        if (data.isSuccess) {
          this.toaster.success(data.message);
          this.router.navigateByUrl('/surgical-intervention');
        }
        else
          this.toaster.error(data.message);
      });
    }
  }
}
