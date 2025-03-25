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
  loading: boolean = false;
  errorMessage: string = '';
  userId: number | null = null;


  constructor(
    private openSpaceService: OpenspaceService,
    @Optional() public dialogRef: MatDialogRef<AnonymousreportComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('success_token'); // Get token
      if (!token) {
        this.errorMessage = 'Authentication token missing. Please log in.';
        console.warn("No token found in localStorage.");
        return;
      }

      this.fetchReports();  // Fetch reports only if token is valid
    } else {
      console.warn("localStorage is not available (probably running on server-side).");
    }
  }

  fetchReports(): void {
    const token = localStorage.getItem('success_token');

    if (!token) {
      this.errorMessage = "Authentication token missing. Please log in.";
      console.warn("No token found. Aborting request.");
      return;
    }

    this.loading = true;
    console.log("Fetching reports...");

    this.openSpaceService.getMyReports().subscribe({
      next: (response: any) => {
        console.log("API Response:", response);
        this.reports = response?.data?.myReports ?? [];

        this.loading = false;
        if (!this.reports.length) {
          console.warn("No reports found.");
          this.errorMessage = "No reports found.";
        }
      },
      error: (error) => {
        console.error("Error fetching reports:", error);
        this.errorMessage = error?.message || "Failed to fetch reports. Please try again.";
        this.loading = false;
      }
    });
  }




  closeDialog(): void {
    this.dialogRef.close();
  }
}

