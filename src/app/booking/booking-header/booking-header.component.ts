import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-header',
  standalone: false,
  templateUrl: './booking-header.component.html',
  styleUrl: './booking-header.component.scss'
})
export class BookingHeaderComponent {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}


  NavigateToDashboard() {
    this.router.navigate(['/booking-dashboard']);
  }

  NavigateToOpenspace() {
    this.router.navigate(['/booking-map']);
  }

  NavigateBack() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/homepage']);
    } else {
      this.router.navigate(['/user-home']);
    }
  }


  NavigateToLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');

  this.toastr.success('Logout success', '', {
    timeOut: 1500,
    progressBar: true,
    positionClass: 'toast-top-right'
  });
  setTimeout(() => {
    this.router.navigate(['/user-home']);
  }, 1500);
}

}
