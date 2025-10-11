import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient, PatientFormStep } from '../../../models/patient.model';

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
  steps: PatientFormStep[] = [
    { title: 'المعلومات الشخصية', isCompleted: false },
    { title: 'المعلومات الطبية', isCompleted: false },
    { title: 'معلومات التأمين', isCompleted: false },
    { title: 'جهة الاتصال في حالات الطوارئ', isCompleted: false }
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
      // Step 1: Personal Information
      fullName: ['', Validators.required],
      nationalId: [''],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.email],
      address: [''],

      // Step 2: Medical Information
      bloodType: [''],
      height: [null],
      weight: [null],
      allergies: this.fb.array([]),
      chronicDiseases: this.fb.array([]),

      // Step 3: Insurance Information
      insuranceProvider: [''],
      insuranceNumber: [''],
      insuranceExpiryDate: [null],

      // Step 4: Emergency Contact
      emergencyContactName: [''],
      emergencyContactRelation: [''],
      emergencyContactPhone: ['']
    });
  }

  // Form Array Getters
  // Use FormArray<FormControl> generics so controls are strongly typed as FormControl
  get allergiesArray(): FormArray<FormControl> {
    return this.patientForm.get('allergies') as FormArray<FormControl>;
  }

  get chronicDiseasesArray(): FormArray<FormControl> {
    return this.patientForm.get('chronicDiseases') as FormArray<FormControl>;
  }

  // Add/Remove Form Array Items
  addAllergy(): void {
    // create a typed FormControl and push into the typed FormArray
    this.allergiesArray.push(this.fb.control<string>('') as FormControl);
  }

  removeAllergy(index: number): void {
    this.allergiesArray.removeAt(index);
  }

  addChronicDisease(): void {
    this.chronicDiseasesArray.push(this.fb.control<string>('') as FormControl);
  }

  removeChronicDisease(index: number): void {
    this.chronicDiseasesArray.removeAt(index);
  }

  // Navigation Methods
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.steps[this.currentStep - 1].isCompleted = true;
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
      case 3:
      case 4:
        return true; // No required fields in these steps
      default:
        return false;
    }
  }

  validateStep1(): boolean {
    const requiredFields = ['fullName', 'gender', 'birthDate', 'phoneNumber'];
    let isValid = true;

    requiredFields.forEach(field => {
      const control = this.patientForm.get(field);
      if (control?.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    return isValid;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getGenderText(gender: string): string {
    return gender === 'male' ? 'ذكر' : gender === 'female' ? 'أنثى' : '';
  }

  savePatient(): void {
    if (this.patientForm.valid) {
      const patientData: Patient = this.patientForm.value;
      
      this.patientService.addPatient(patientData).subscribe(
        (newPatient) => {
          alert('تم حفظ بيانات المريض بنجاح');
          this.router.navigate(['/patients']);
        },
        (error) => {
          console.error('Error saving patient:', error);
          alert('حدث خطأ أثناء حفظ بيانات المريض');
        }
      );
    } else {
      this.markFormGroupTouched(this.patientForm);
      alert('يرجى التحقق من البيانات المدخلة');
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