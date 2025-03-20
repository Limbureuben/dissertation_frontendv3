import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-report',
  standalone: false,
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss'
})
export class ViewReportComponent {


  private backendUrl = 'http://127.0.0.1:8000/api/v1/upload/';

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
}
