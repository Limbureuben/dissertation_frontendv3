import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {
  constructor(private router: Router) {}

  OpenDashboard() {
    this.router.navigate(['/map-display'])
  }

  OPenBookDasboard() {
    this.router.navigate(['/'])
  }

  navigateToCreateAccount() {

  }

}
