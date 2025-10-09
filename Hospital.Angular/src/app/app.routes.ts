import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard.component';

export const routes: Routes = [
	{
		path: '',
		component: AdminLayoutComponent,
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'dashboard', component: DashboardComponent },
			// Add more hospital feature routes here
		]
	}
];
