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
  UserModel = { userName: 'Admin ', loginDate: '2025-10-09', loginTime: '10:00' };
  RoleName = 'Administrator';
  onCloseSidemenuFromOverlay() { this.closeSideMenuFromOverlayEvent.emit(); }
}
