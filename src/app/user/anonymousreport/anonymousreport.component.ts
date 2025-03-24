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
  userId: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private openSpaceService: OpenspaceService,
    @Optional() public dialogRef: MatDialogRef<AnonymousreportComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id'); // Get user ID
      console.log("Retrieved user_id from localStorage:", storedUserId);

      if (!storedUserId) {
        this.errorMessage = 'No user ID found. Please log in to view reports.';
        return;
      }

      this.userId = storedUserId;
      this.fetchReports();
    } else {
      console.warn("localStorage is not available (probably running on server-side).");
    }
  }

  fetchReports() {
    if (!this.userId) return; // Prevent execution if userId is null

    this.loading = true;
    console.log("Fetching reports for userId:", this.userId); // Debugging

    this.openSpaceService.getMyReports(this.userId).subscribe({
      next: (response: any) => {
        console.log("API Response:", response); // Log the full response
        this.reports = response.data?.myReports || []; // Ensure safe access
        this.loading = false;

        if (this.reports.length === 0) {
          console.warn("No reports found for this user.");
          this.errorMessage = "No reports found.";
        }
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to fetch reports. Please try again later.';
        this.loading = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

