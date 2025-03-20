import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-report',
  standalone: false,
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss'
})
export class ViewReportComponent {


  private backendUrl = 'http://127.0.0.1:8000/media/';
  isImageModalOpen = false;
  selectedImage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ViewReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeForm(): void {
    this.dialogRef.close();
  }

  getFileUrl(): string {
    return this.data.file ? `${this.backendUrl}${this.data.file}` : '';
  }

  openImageModal(imagePath: string): void {
    this.selectedImage = imagePath;
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }
}
