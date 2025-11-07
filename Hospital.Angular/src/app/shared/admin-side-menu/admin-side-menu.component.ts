import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-side-menu',
  standalone: true,
  imports: [NgbCollapse, RouterLink, RouterLinkActive],
  templateUrl: './admin-side-menu.component.html',
  styleUrls: ['./admin-side-menu.component.css']
})
export class AdminSideMenuComponent implements OnInit {
  @Input() isCollapsing = false;
  @Output() closeSideMenuFromOverlayEvent = new EventEmitter<void>();
  isCollapsed_1 = true;
  isCollapsed_2 = true;
  UserModel = { userName: 'Admin ', loginDate: '2025-10-09', loginTime: '10:00' };
  RoleName = 'Administrator';
  private routeSub?: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateCollapseState(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateCollapseState(event.urlAfterRedirects);
      });
  }

  private updateCollapseState(currentUrl: string) {
    const patientRoutes = [
      '/patients',
      '/admissions',
      '/surgical-intervention',
      '/follow-up'
    ];

    const doctorRoutes = [
      '/doctors',
    ];

    if (patientRoutes.some(r => currentUrl.startsWith(r))) {
      this.isCollapsed_1 = false;
    } else {
      this.isCollapsed_1 = true;
    }

    if (doctorRoutes.some(r => currentUrl.startsWith(r))) {
      this.isCollapsed_2 = false;
    } else {
      this.isCollapsed_2 = true;
    }
  }
  
  onCloseSidemenuFromOverlay() {
    this.closeSideMenuFromOverlayEvent.emit();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
