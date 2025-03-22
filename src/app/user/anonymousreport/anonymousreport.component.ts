import { Component, Inject, OnInit, Optional } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-anonymousreport',
  standalone: false,
  templateUrl: './anonymousreport.component.html',
  styleUrl: './anonymousreport.component.scss'
})
export class AnonymousreportComponent implements OnInit {
  reports: any[] = [];
  sessionId: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private openSpaceService: OpenspaceService,
    @Optional() public dialogRef: MatDialogRef<AnonymousreportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
