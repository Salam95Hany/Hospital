import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-side-menu',
  standalone: true,
  imports: [NgbCollapse, RouterLink, RouterLinkActive],
  templateUrl: './admin-side-menu.component.html',
  styleUrls: ['./admin-side-menu.component.css']
})
export class AdminSideMenuComponent {
  @Input() isCollapsing = false;
  @Output() closeSideMenuFromOverlayEvent = new EventEmitter<void>();
  isCollapsed_1 = true;
  UserModel = { userName: 'مدير المستشفى', loginDateAr: '2025-10-09', loginTimeAr: '10:00' };
  RoleName = 'مدير النظام';
  onCloseSidemenuFromOverlay() { this.closeSideMenuFromOverlayEvent.emit(); }
}
