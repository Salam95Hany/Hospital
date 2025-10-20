import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-breadcrumb.component.html',
  styleUrl: './admin-breadcrumb.component.css'
})
export class AdminBreadcrumbComponent {
  @Input() Title: string
}
