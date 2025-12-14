import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-patient-last-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-last-details.component.html',
  styleUrls: ['./patient-last-details.component.css'],
  providers: [DatePipe]
})
export class PatientLastDetailsComponent implements OnInit {
  @Input() patientId: number | null = null;

  loading = false;
  error: string | null = null;
  data: any = null;
  // Doctors lookup similar to surgical list component
  DoctorsData: { id: string, name: string }[] = [];
  DoctorPagingFilter: { filterList: any[]; currentpage: number; pagesize: number } = {
    filterList: [],
    currentpage: 1,
    pagesize: 1000
  };
  lastSurgicalDoctorNames: string[] = [];

  constructor(private patientService: PatientService, private datePipe: DatePipe, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.fetch();
  }

  ngOnChanges(): void {
    this.fetch();
  }

  private fetch(): void {
    if (!this.patientId) return;
    this.loading = true;
    this.error = null;
    this.patientService.getPatientLastDetailsById(this.patientId).subscribe({
      next: (res) => {
        this.data = res?.results ?? res;
        this.loading = false;
        this.computeDoctorNames();
      },
      error: (err) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
      }
    });
  }

  private loadDoctors(): void {
    this.doctorService.GetAllDoctorData(this.DoctorPagingFilter).subscribe(res => {
      const list = (res?.results || []);
      this.DoctorsData = list.map((i: any) => ({ id: i.doctorId?.toString(), name: i.doctorName }));
      this.computeDoctorNames();
    });
  }

  private computeDoctorNames(): void {
    // Compute names for last surgical intervention doctorId CSV if both data and DoctorsData are available
    const surg = (this.data?.LastSurgicalIntervention || this.data?.lastSurgicalIntervention) || null;
    const idsCsv: string = surg?.doctorId ?? surg?.DoctorId ?? '';
    if (!idsCsv || this.DoctorsData.length === 0) {
      this.lastSurgicalDoctorNames = [];
      return;
    }
    const ids = idsCsv.toString().split(',').map(s => s.trim()).filter(Boolean);
    this.lastSurgicalDoctorNames = ids
      .map(id => this.DoctorsData.find(d => d.id === id)?.name)
      .filter((name): name is string => !!name);
  }

  formatDate(value: any): string {
    if (!value) return '';
    return this.datePipe.transform(value, 'yyyy-MM-dd') || '';
  }

  formatUrine(value: any): string {
    if (value === null || value === undefined) return '';
    let s = String(value);
    // Remove stray occurrences of the word 'enter' (case-insensitive)
    s = s.replace(/enter/gi, '').replace(/\s+/g, ' ').trim();
    if (!s) return '';
    // Normalize separator to colon for readability
    if (s.includes(';')) {
      const [name, ...rest] = s.split(';');
      const val = rest.join(';').trim();
      return val ? `${name.trim()}: ${val}` : name.trim();
    }
    return s;
  }
}
