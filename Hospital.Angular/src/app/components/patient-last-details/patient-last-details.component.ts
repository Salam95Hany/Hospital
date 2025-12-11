import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PatientService } from '../../services/patient.service';

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

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
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
      },
      error: (err) => {
        this.error = 'Failed to load patient details';
        this.loading = false;
      }
    });
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
