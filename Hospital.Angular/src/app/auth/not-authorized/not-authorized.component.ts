import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-not-authorized',
  imports: [],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css'
})
export class NotAuthorizedComponent {

  constructor(private authService: AuthService) { }

  Logout() {
    this.authService.AdminLogout(this.authService?.userId).subscribe(data => {
      if (data) {
        this.authService.loginRedirect();
      }
    });
  }
}
