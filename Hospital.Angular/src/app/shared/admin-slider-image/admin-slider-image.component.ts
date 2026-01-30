import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-slider-image',
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase],
  templateUrl: './admin-slider-image.component.html',
  styleUrl: './admin-slider-image.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminSliderImageComponent {
  @Input() Images: any[] = [];
  @Input() DetailsMode: boolean = false;
  @Output() RefreshImage = new EventEmitter<boolean>();
  selectedMedia = null;

  constructor(private adminService: AdminService, private toaster: ToastrService) {
    console.log(this.Images);

  }

  openImage(url: string, type: string) {
    this.selectedMedia = { url, type };
  }

  closeImage() {
    this.selectedMedia = null;
  }

  DownloadFile(item: any) {
    this.adminService.DownloadFile(item.fileName, item.actionType).subscribe((fileBlob) => {
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.existFileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  DeleteFile(item: any) {
    this.adminService.DeleteFile(item.attachmentId, item.fileName, item.actionType).subscribe(res => {
      if (res.isSuccess) {
        this.toaster.success(res.message);
        this.RefreshImage.emit(true);
        this.Images = this.Images.filter(i => i.attachmentId != item.attachmentId);
      } else
        this.toaster.error(res.message);
    });
  }

  trackByImageId(index: number, item: any): any {
    return item.attachmentId || item.fileName || index;
  }
}
