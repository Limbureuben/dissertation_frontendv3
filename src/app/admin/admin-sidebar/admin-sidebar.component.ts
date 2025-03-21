import { Component, OnInit } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit{

  totalOpenspaces: number = 0;

  constructor(
    private openspaceservice: OpenspaceService,
    private authservice: AuthService
  ) {}

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

  OnLogout() {
    this.authservice.Logout();
  }

}
