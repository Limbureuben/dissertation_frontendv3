import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenspaceService } from '../../service/openspace.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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

  constructor(
    private router: Router,
    private openspaceservice: OpenspaceService
  ) {}

  navigateToMap() {
    this.router.navigate(['/map-common'])
  }

  ngOnInit(): void {
    this.openspaceservice.getOpenspaceCount().subscribe({
      next: (result) => {
        this.totalOpenspaces = result.data.totalOpenspaces;
      },
      error: (err) => {
        console.error('Error fetching total open spaces', 'err')
      }
    });
}



}
