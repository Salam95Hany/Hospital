import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RoleCheckerDirective } from '../../directives/role-checker.directive';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-side-menu',
  standalone: true,
  imports: [NgbCollapse, RouterLink, RouterLinkActive, RoleCheckerDirective,CommonModule],
  templateUrl: './admin-side-menu.component.html',
  styleUrls: ['./admin-side-menu.component.css']
})
export class AdminSideMenuComponent implements OnInit {
  @Input() isCollapsing = false;
  @Output() closeSideMenuFromOverlayEvent = new EventEmitter<void>();
  isCollapsed_1 = true;
  isCollapsed_2 = true;
  UserModel: any;
  private routeSub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.UserModel = this.authService.UserModel;
  }

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
      '/admin/patients',
      '/admin/admissions',
      '/admin/surgical-intervention',
      '/admin/follow-up'
    ];

    const doctorRoutes = [
      '/admin/doctors',
      '/admin/users',
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
