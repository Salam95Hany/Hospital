import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Input() isCollapseOrExpand = false;
  @Output() collapseExpandContent = new EventEmitter<void>();
  collapsed = true;
  isSearchOpen = false;
  showAutoCompleteMenu = false;
  isUserDropdownOpen = false;
  SearchText = '';
  PagesList = [
    { name: 'dashboard', pageUrl: '/admin/dashboard' },
    { name: 'patients', pageUrl: '/admin/patients' },
    { name: 'doctors', pageUrl: '/admin/doctors' },
    { name: 'appointments', pageUrl: '/admin/appointments' },
    { name: 'departments', pageUrl: '/admin/departments' },
    { name: 'users', pageUrl: '/admin/users' }
  ];
  UserModel: any;

  constructor(private authService: AuthService) {
    this.UserModel = this.authService.UserModel;
  }

  goToWebsite() { }
  onCollapseExpandMenu() { this.collapseExpandContent.emit(); }
  onShowAutoCompleteMenu(inputEle: any) { this.showAutoCompleteMenu = !!inputEle.value; }
  HandleSearchEle(i: number, inputEle: any) { this.SearchText = this.PagesList[i].name; this.showAutoCompleteMenu = false; inputEle.value = ''; }
  toggleUserDropdown() { this.isUserDropdownOpen = !this.isUserDropdownOpen; }
  Logout() {
    this.authService.loginRedirect();
  }
}
