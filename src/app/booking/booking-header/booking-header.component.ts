import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-header',
  standalone: false,
  templateUrl: './booking-header.component.html',
  styleUrl: './booking-header.component.scss'
})
export class BookingHeaderComponent {

  constructor(
    private router: Router
  ) {}


  NavigateToDashboard() {
    this.router.navigate(['/booking-dashboard']);
  }

}
