import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { PatientsListComponent } from './components/patients/patients-list/patients-list.component';
import { PatientCreateComponent } from './components/patients/patient-create/patient-create.component';
import { DoctorsListComponent } from './components/doctors/doctors-list/doctors-list.component';
import { DoctorCreateComponent } from './components/doctors/doctor-create/doctor-create.component';

export const routes: Routes = [
	{
		path: '',
		component: AdminLayoutComponent,
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'patients', component: PatientsListComponent },
			{ path: 'patients/add', component: PatientCreateComponent },
			{ path: 'patients/edit/:id', component: PatientCreateComponent },
			{ path: 'patients/view/:id', component: PatientsListComponent },
			{ path: 'doctors', component: DoctorsListComponent },
			{ path: 'doctors/add', component: DoctorCreateComponent },
			{ path: 'doctors/edit/:id', component: DoctorCreateComponent },
			{ path: 'doctors/view/:id', component: DoctorsListComponent },
			// Add more hospital feature routes here
		]
	}
];
