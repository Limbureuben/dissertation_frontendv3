import { Component, Inject, OnInit, Optional } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-anonymousreport',
  standalone: false,
  templateUrl: './anonymousreport.component.html',
  styleUrl: './anonymousreport.component.scss',
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class AnonymousreportComponent implements OnInit {
  reports: any[] = [];
  sessionId: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private openSpaceService: OpenspaceService,
    @Optional() public dialogRef: MatDialogRef<AnonymousreportComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedSessionId = localStorage.getItem('session_id');

      if (!storedSessionId) {
        this.errorMessage = 'No session ID found. Please submit a report first.';
        return;
      }

      this.sessionId = storedSessionId ?? ''; // Ensure sessionId is a string
      this.fetchReports();
    } else {
      console.warn("localStorage is not available (probably running on server-side).");
    }
  }

  fetchReports() {
    if (!this.sessionId) return; // Prevent execution if sessionId is null

    this.loading = true;
    this.openSpaceService.getAnonymousReports(this.sessionId).subscribe({
      next: (response: any) => {
        this.reports = response.data.anonymousReports;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to fetch reports. Please try again later.';
        this.loading = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
