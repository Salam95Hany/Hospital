import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';

@Component({
  selector: 'app-doctor-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-create.component.html',
  styleUrls: ['./doctor-create.component.css']
})
export class DoctorCreateComponent implements OnInit {
  doctorForm!: FormGroup;
  editingId?: number;

  constructor(private fb: FormBuilder, private doctorService: DoctorService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      specialization: [''],
      department: [''],
      phoneNumber: [''],
      email: ['', Validators.email],
      licenseNumber: [''],
      address: ['']
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editingId = +id;
      this.doctorService.getDoctorById(this.editingId).subscribe(d => {
        if (d) this.doctorForm.patchValue(d);
      });
    }
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      const data: Doctor = this.doctorForm.value;
      if (this.editingId) { data.id = this.editingId; this.doctorService.updateDoctor(data).subscribe(() => this.router.navigate(['/doctors'])); }
      else { this.doctorService.addDoctor(data).subscribe(() => this.router.navigate(['/doctors'])); }
    } else {
      this.doctorForm.markAllAsTouched();
      alert('يرجى التحقق من الحقول المطلوبة');
    }
  }

  cancel(): void { this.router.navigate(['/doctors']); }
}
