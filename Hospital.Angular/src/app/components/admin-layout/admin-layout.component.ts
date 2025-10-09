import { Component } from '@angular/core';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';
import { AdminSideMenuComponent } from '../../shared/admin-side-menu/admin-side-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminHeaderComponent, AdminSideMenuComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isCollapseExpand = false;
}
