import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {
  patientForm!: FormGroup;
  currentStep: number = 1;
  steps = [
    { title: 'Patient Information', isCompleted: false },
    { title: 'Admission Details', isCompleted: false },
    { title: 'Surgical Intervention', isCompleted: false },
    { title: 'Follow-Up', isCompleted: false }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      patient: this.fb.group({
        name: ['', Validators.required],
        birthDate: [null],
        age: [null],
        gender: [''],
        nationalId: [''],
        address: [''],
        governorate: [''],
        occupation: [''],
        maritalStatus: [''],
        childrenCount: [''],
        internalNumber: ['']
      }),
      admission: this.fb.group({
        hospitalFileNumber: [''],
        admissionDate: [null],
        dischargeDate: [null],
        chiefComplaint: [''],
        duration: [''],
        course: [''],
        hpi: [''],
        currentMedications: [''],
        pastHistory: [''],
        familyHistory: [''],
        comorbidities: [''],
        bmi: [''],
        temperature: [null],
        pulse: [null],
        bloodPressure: [''],
        generalExamination: [''],
        abdominalExamination: [''],
        genitalExamination: [''],
        dreVaginalExamination: [''],
        labResults: [''],
        imagingResults: [''],
        provisionalDiagnosis: [''],
        medicalDecision: [''],
        scheduledDate: [null]
      }),
      surgicalIntervention: this.fb.group({
        interventionDate: [null],
        theater: [''],
        mainSurgeon: [''],
        assistants: [''],
        resident: [''],
        anesthesia: [''],
        intervention: [''],
        interventionDetails: [''],
        tubesFixed: [''],
        category: [''],
        approach: [''],
        organ: [''],
        intraOperativeCourse: [''],
        intraOpAdverseEvents: [''],
        bloodTransfusionUnits: [null],
        postOpRecommendations: [''],
        postOpDay0_1: [''],
        postOpDay2_5: [''],
        postOpDayOver5: [''],
        postOpAdverseEvents: [''],
        dischargeDate: [null],
        finalDiagnosis: [''],
        dischargeInstructions: [''],
        followUpDoctor: [''],
        followUpDoctorPhone: [''],
        followUpAppointment: [null]
      }),
      followUp: this.fb.group({
        followUpDate: [null, Validators.required],
        patientRemarks: [''],
        patientRemarksDetails: [''],
        examinationFindings: [''],
        woundStatus: [''],
        catheters: [''],
        labResults: [''],
        imagingResults: [''],
        imagePath: [''],
        advice: [''],
        newDecision: [''],
        nextFollowUpDate: [null]
      })
    });
  }

  // Navigation Methods
  nextStep(): void {
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

  getFormGroupForStep(step: number): FormGroup {
    const stepKeys = ['patient', 'admission', 'surgicalIntervention', 'followUp'];
    return this.patientForm.get(stepKeys[step - 1]) as FormGroup;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.getFormGroupForStep(this.currentStep).get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  savePatient(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;
      console.log('Patient Data:', patientData);
      // The service call needs to be adapted to handle the new data structure
      // this.patientService.addPatient(patientData).subscribe(...)
      alert('Patient data saved successfully! (Check console for data)');
      this.router.navigate(['/patients']);
    } else {
      this.markFormGroupTouched(this.patientForm);
      alert('Please fill all required fields.');
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }
}