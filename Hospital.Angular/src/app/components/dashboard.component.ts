import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  CardData: any;

  constructor(private patientService: PatientService) {

  }

  ngOnInit(): void {
    this.patientService.GetDashboardStatistics().subscribe(res => {
      this.CardData = res.results;
    })
  }


}
