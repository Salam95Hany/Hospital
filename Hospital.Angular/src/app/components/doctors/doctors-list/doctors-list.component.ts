import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from '../../../models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchTerm: string = '';

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(d => { this.doctors = d; this.applyFilter(); });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) { this.filteredDoctors = this.doctors; return; }
    const s = this.searchTerm.toLowerCase();
    this.filteredDoctors = this.doctors.filter(d =>
      d.fullName.toLowerCase().includes(s) ||
      (d.licenseNumber || '').toLowerCase().includes(s) ||
      (d.specialization || '').toLowerCase().includes(s) ||
      (d.phoneNumber || '').toLowerCase().includes(s)
    );
  }

  navigateToAddDoctor(): void { this.router.navigate(['/doctors/add']); }
  viewDoctor(id?: number): void { if (id) this.router.navigate(['/doctors/view', id]); }
  editDoctor(id?: number): void { if (id) this.router.navigate(['/doctors/edit', id]); }
  deleteDoctor(id?: number): void {
    if (id && confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
      this.doctorService.deleteDoctor(id).subscribe(ok => { if (ok) this.loadDoctors(); });
    }
  }
  // addDoctor removed; navigation handled by navigateToAddDoctor
}
