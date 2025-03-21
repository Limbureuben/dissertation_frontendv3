import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';

@Component({
  selector: 'app-anonymousreport',
  standalone: false,
  templateUrl: './anonymousreport.component.html',
  styleUrl: './anonymousreport.component.scss'
})
export class AnonymousreportComponent implements OnInit{
  reports: any[] = [];
  sessionId: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private openSpaceService: OpenspaceService) {}

  ngOnInit(): void {
    const storedSessionId = localStorage.getItem('session_id');

    if (!storedSessionId) {
      this.errorMessage = 'No session ID found. Please submit a report first.';
      return;
    }
    this.sessionId = storedSessionId;
  this.fetchReports();
  }

  fetchReports() {
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
    })
  }

}
