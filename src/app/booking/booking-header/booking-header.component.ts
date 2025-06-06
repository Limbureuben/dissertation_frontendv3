import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingHistoryComponent } from '../booking-history/booking-history.component';

@Component({
  selector: 'app-booking-header',
  standalone: false,
  templateUrl: './booking-header.component.html',
  styleUrl: './booking-header.component.scss'
})
export class BookingHeaderComponent {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
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

  NavigateToCalender() {
    this.router.navigate(['/calender']);
  }

  openReportHistoryDialog() {
    this.dialog.open(BookingHistoryComponent, {
      width: '1200px',
      height: '500px',
      disableClose: false
    });
  }

}
