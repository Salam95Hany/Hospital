import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { PatientData } from '../../../models/patient.model';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {
  patientData: PatientData = new PatientData();
  currentStep: number = 1;
  steps = [
    { title: 'Patient Information', isCompleted: false },
    { title: 'Admission Details', isCompleted: false },
    { title: 'Surgical Intervention', isCompleted: false },
    { title: 'Follow-Up', isCompleted: false }
  ];

  constructor(
    private patientService: PatientService,
    private router: Router
  ) { }

  ngOnInit(): void {
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

  savePatient(): void {
    console.log('Patient Data:', this.patientData);
    // The service call needs to be adapted to handle the new data structure
    // this.patientService.addPatient(this.patientData).subscribe(...);
    alert('Patient data saved successfully! (Check console for data)');
    this.router.navigate(['/patients']);
  }

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }
}