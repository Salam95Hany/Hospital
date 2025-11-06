import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FilesModel, UploadFileModel } from '../../models/UploadFileModel';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-upload-file',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './admin-upload-file.component.html',
  styleUrl: './admin-upload-file.component.css'
})
export class AdminUploadFileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() FilesChenged = new EventEmitter<UploadFileModel>();
  SelectedFiles: UploadFileModel = {
    actionId: null,
    actionType: null,
    insertUser: '',
    files: [],
    deletedFiles: []
  };
  isDragOver = false;

  constructor(private authService: AuthService, private adminService: AdminService) {
    this.SelectedFiles.insertUser = this.authService.userId;
  }

  ngOnInit(): void {}

  onAreaClick() {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
    this.FilesChenged.emit(this.SelectedFiles);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.handleFiles(files);
    this.FilesChenged.emit(this.SelectedFiles);
  }

  handleFiles(files: File[]) {
    files.forEach(i => {
      let obj: FilesModel = {
        attachmentId: null,
        existFileName: i.name,
        fileName: i.name,
        fileSize: this.formatFileSize(i.size),
        file: i
      };

      let checked = this.SelectedFiles.files.find(i => i.existFileName == obj.existFileName);
      if (!checked)
        this.SelectedFiles.files.push(obj);
    });
  }

  removeFile(index: number, file: FilesModel) {
    if (file?.attachmentId) {
      this.SelectedFiles.deletedFiles.push({ attachmentId: file.attachmentId, fileName: file.fileName });
    }
    this.SelectedFiles.files.splice(index, 1);
    this.FilesChenged.emit(this.SelectedFiles);
  }

  downloadFile(file: any) {
    this.adminService.DownloadFile(file.fileName, file.actionType).subscribe((fileBlob) => {
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.existFileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
