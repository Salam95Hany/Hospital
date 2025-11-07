import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { PatientsListComponent } from './components/patients/patients-list/patients-list.component';
import { PatientCreateComponent } from './components/patients/patient-create/patient-create.component';
import { DoctorsListComponent } from './components/doctors/doctors-list/doctors-list.component';
import { AdmissionListComponent } from './components/admission/admission-list/admission-list.component';
import { SurgicalInterventionListComponent } from './components/surgicalIntervention/surgical-intervention-list/surgical-intervention-list.component';
import { FollowupListComponent } from './components/followup/followup-list/followup-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthService } from './auth/auth.service';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsListComponent },
      { path: 'patients/add', component: PatientCreateComponent },
      { path: 'patients/edit/:id', component: PatientCreateComponent },
      { path: 'patients/view/:id', component: PatientsListComponent },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'admissions', component: AdmissionListComponent },
      { path: 'surgical-intervention', component: SurgicalInterventionListComponent },
      { path: 'follow-up', component: FollowupListComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
