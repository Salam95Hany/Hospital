import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { PatientsListComponent } from './components/patients/patients-list/patients-list.component';
import { PatientCreateComponent } from './components/patients/patient-create/patient-create.component';
import { DoctorsListComponent } from './components/doctors/doctors-list/doctors-list.component';
import { AdmissionListComponent } from './components/admission/admission-list/admission-list.component';
import { SurgicalInterventionListComponent } from './components/surgicalIntervention/surgical-intervention-list/surgical-intervention-list.component';
import { FollowupListComponent } from './components/followup/followup-list/followup-list.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { NotAuthorizedComponent } from './auth/not-authorized/not-authorized.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ["SupperAdmin", "Admin"] },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'patients',
        component: PatientsListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'patients/add',
        component: PatientCreateComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'patients/edit/:id',
        component: PatientCreateComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'patients/view/:id',
        component: PatientsListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'doctors',
        component: DoctorsListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin"] },
      },
      {
        path: 'admissions',
        component: AdmissionListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'surgical-intervention',
        component: SurgicalInterventionListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      {
        path: 'follow-up',
        component: FollowupListComponent,
        canActivate: [authGuard],
        data: { roles: ["SupperAdmin", "Admin"] },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },

];
