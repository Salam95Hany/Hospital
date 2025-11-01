import { NgFor, NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-admin-slider-image',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './admin-slider-image.component.html',
  styleUrl: './admin-slider-image.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminSliderImageComponent {
  @Input() Images: any[] = [];
}
