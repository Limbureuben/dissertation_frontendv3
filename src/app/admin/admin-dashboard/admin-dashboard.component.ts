import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenspaceService } from '../../service/openspace.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { allowNavigation } from '../../guards/admin-exist.guard';
import { error } from 'console';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query('.stat-card', [
          style({ opacity: 0, transform: 'scale(0.8)' }),
          stagger(200, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit{

  totalOpenspaces: number = 0;
  totalHistorys: number = 0;
  totalReport: number = 0;

  constructor(
    private router: Router,
    private openspaceservice: OpenspaceService,
  ) {}

  enableNavigation() {
    allowNavigation(); // This will allow navigation
    console.log("Admin action taken, navigation unlocked.");
  }

  navigateToMap() {
    this.router.navigate(['/map-common'])
  }

  ngOnInit(): void {
    forkJoin({
      totalOpenspaces: this.openspaceservice.getOpenspaceCount(),
      totalHistorys: this.openspaceservice.getAllHistoryReport(),
      totalReport: this.openspaceservice.getAllReportPending()
    }).subscribe({
      next: ({ totalOpenspaces, totalHistorys, totalReport }) => {
        this.totalOpenspaces = totalOpenspaces.data.totalOpenspaces;
        this.totalHistorys = totalHistorys.data.totalHistorys;
        this.totalReport = totalReport.data.totalReport;
      },
      error: (err) => {
        console.error('Error fetching data', err);
      }
    });
  }


  NavigateToOpenSpace() {
    this.router.navigate(['/openspace'])
  }

  NavigateToHistory() {
    this.router.navigate(['/history'])
  }

  NavigateToReport() {
    this.router.navigate(['/reports'])
  }

}
