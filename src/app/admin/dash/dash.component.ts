import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dash',
  standalone: false,
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss',
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.dashboard-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashComponent implements OnInit{
  recentReports: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'title', 'status', 'date'];

  totalOpenspaces: number = 0;
  totalHistorys: number = 0;
  totalReport: number = 0;

  constructor(
    private opespace: OpenspaceService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.opespace.getOpenspaceCount().subscribe({
      next: (result) => {
        this.totalOpenspaces = result.data.totalOpenspaces;
      },
      error: (err) => {
        console.error('Error fetching total open spaces', 'err')
      }
    });

    this.opespace.getAllHistoryReport().subscribe({
      next: (result) => {
        this.totalHistorys = result.data.totalHistorys;
      },
      error: (error)=> {
        console.error('Error fetching the report history')
      }
    });

    this.opespace.getAllReportPending().subscribe({
      next: (result) => {
        this.totalReport = result.data.totalReport;
      },
      error: (error) => {
        console.error('Error fetching report pending')
      }
    });

    this.opespace.getAllReports().subscribe((data) => {
      this.recentReports = data.slice(-5).reverse();
      this.dataSource.data = data;
    });
}


OpenAvailableSpaces() {
  this.router.navigate(['/admin/openspace']);
}

OpenSolvedIssues() {
  this.router.navigate(['/admin/history']);
}

OpenPendingIssues() {
  this.router.navigate(['/admin/reports']);
}

}
