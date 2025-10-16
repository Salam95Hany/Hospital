import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Admission, FollowUp, Patient, PatientData, SurgicalIntervention } from '../../../models/patient.model';

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

  governorates = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
    'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia', 'New Valley', 'Suez',
    'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta', 'Sharkia', 'Sohag',
    'Kafr El Sheikh', 'Luxor', 'Qena', 'North Sinai', 'South Sinai', 'Matrouh'
  ];

  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Child'];
  courses = ['Progressing', 'Stationary', 'Regressing', 'On & off'];
  comorbidities = [
    { name: 'Diabetes', checked: false },
    { name: 'Hypertension', checked: false },
    { name: 'Cardiac', checked: false },
    { name: 'Chest', checked: false },
    { name: 'Renal insufficiency', checked: false },
    { name: 'Orthopedic', checked: false },
    { name: 'Neurologic', checked: false },
    { name: 'Others', checked: false }
  ];
  bmis = ['low', 'Average', 'Overweight', 'Obese', 'Morbidly obese'];
  urineAnalyses = [
    { name: 'Pus cells', checked: false },
    { name: 'RBCs', checked: false },
    { name: 'Crystals', checked: false },
    { name: 'Albumin', checked: false },
    { name: 'Sugar', checked: false },
    { name: 'Others', checked: false }
  ];
  theatres = ['A', 'B', 'C', 'Main', 'Dpt', 'US'];
  anaesthesias = ['General', 'Regional', 'Local'];
  tubesFixed = [
    { name: 'Drain', checked: false },
    { name: 'Urethral catheter', checked: false },
    { name: 'S. Pubic catheter', checked: false },
    { name: 'Ureteric catheter', checked: false },
    { name: 'Ureteric Stent', checked: false },
    { name: 'Nephrostomy', checked: false },
    { name: 'Others', checked: false }
  ];
  categories = ['Urolithiasis', 'Oncology', 'LUTD', 'Reconstructive', 'Andrology', 'Pediatric'];
  approaches = ['Endourology', 'Open Surgery', 'Laparoscopy', 'Microscopic'];
  organs = ['Adrenal', 'Kidney', 'Ureter', 'Bladder', 'Prostate', 'Urethra', 'Penis', 'Scrotum/Testes', 'Others'];
  intraOpCourses = ['Smooth', 'Minor adv. Events', 'Moderate adv. Events', 'Major dv. events'];
  postOpCourses = ['Smooth', 'Minor adv. Events', 'Moderate adv. Events', 'Major dv. events'];
  patientRemarks = ['Better', 'Worse', 'The same', 'Details'];
  patientId: number | null = null;
  isEditMode: boolean = false;
  constructor(
    private patientService: PatientService,
    private router: Router, private route: ActivatedRoute
  ) {
        this.patientData.patient = new Patient();
        this.patientData.admission =new Admission();
        this.patientData.surgicalIntervention = new SurgicalIntervention();
        this.patientData.followUp = new FollowUp(); 
   }

  ngOnInit(): void {
     
  }
 

  deletePatient(): void {
    if (this.isEditMode && this.patientId) {
      if (confirm('Are you sure you want to delete this patient and all related data?')) {
        this.patientService.deletePatientWithAllData(this.patientId).subscribe(() => {
          this.router.navigate(['/patients']);
        });
      }
    }
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
    debugger
    this.patientService.AddNewPatientFull(this.patientData).subscribe({
      next: (response) => {
        console.log('Patient added successfully', response);
        alert('Patient data saved successfully!');
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Error adding patient', error);
        alert('Error saving patient data. Please try again.');
      }
    });
  }
  

  navigateBack(): void {
    this.router.navigate(['/patients']);
  }
}