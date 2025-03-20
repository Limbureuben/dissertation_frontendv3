import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-report',
  standalone: false,
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.scss',
  animations: [
    trigger('fadeScale', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ViewReportComponent {


  private backendUrl = 'http://127.0.0.1:8000/media/';
  isMediaModalOpen = false;
  selectedMedia: string = '';
  isVideo: boolean = false;

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

  isVideoFile(fileUrl: string): boolean {
    return fileUrl.match(/\.(mp4|webm|ogg)$/i) !== null;
  }

  openMediaModal(mediaUrl: string): void {
    this.selectedMedia = mediaUrl;
    this.isVideo = this.isVideoFile(mediaUrl);
    this.isMediaModalOpen = true;
  }

  closeMediaModal(): void {
    this.isMediaModalOpen = false;
  }
}
