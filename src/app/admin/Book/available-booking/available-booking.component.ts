import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { OpenspaceService } from '../../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../../service/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewbookigComponent } from '../viewbookig/viewbookig.component';

@Component({
  selector: 'app-available-booking',
  standalone: false,
  templateUrl: './available-booking.component.html',
  styleUrl: './available-booking.component.scss',
  animations: [
      trigger('tableEnterAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateX(50px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ])
      ]),
      trigger('rowAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
        ])
      ])
    ]
})
export class AvailableBookingComponent implements OnInit{

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['space_name', 'username', 'status', 'file', 'actions'];
  // displayedColumns: string[] = ['space', 'username', 'contact', 'date', 'duration', 'purpose', 'district', 'file', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedReport: any = null;
  showPopup: boolean = false;
  backendUrl = 'http://localhost:8000';

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
  this.loadBookings();
  }

loadBookings() {
    this.bookingService.getAdminBookingsByDistrict().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewReport(report: any): void {
    this.dialog.open(ViewbookigComponent, {
      width: '600px',
      data: report
    });
  }

  closePopup(): void {
  this.showPopup = false;
  this.selectedReport = null;
}

  getFullFileUrl(filePath: string): string {
      if (!filePath) return '';
      return `${this.backendUrl}${filePath}`;
  }


  confirmReport(reportId: number): void {
    console.log('Confirming booking:', reportId);
  }


acceptNewBooking(row: any): void {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to accept this booking and notify the user via SMS.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, accept it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookingService.acceptNewBooking(row.id).subscribe({
        next: () => {
          Swal.fire("Accepted!", "Booking has been accepted and user notified.", "success");
          this.loadBookings();  // Refresh booking table
        },
        error: (error) => {
          console.error('Accept error:', error);
          Swal.fire("Error", "Failed to accept booking.", "error");
        }
      });
    }
  });
}


rejectBooking(row: any): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'rgb(100, 100, 177)',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, reject it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call the API to reject booking
      this.bookingService.rejectBooking(row.id).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Rejected!',
            text: 'The booking has been rejected and the space is now available.',
            icon: 'success'
          });
          // Refresh the table
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error rejecting booking:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to reject booking. Please try again.',
            icon: 'error'
          });
        }
      });
    }
  });
}

deleteBooking(row: any) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(100, 100, 177)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookingService.deleteBooking(row.id).subscribe({
        next: () => {
          Swal.fire({
            title: "Deleted!",
            text: "Booking has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          this.loadBookings(); // Refresh table
        },
        error: (err) => {
          console.error('Delete error:', err);
          Swal.fire("Error", "Failed to delete booking", "error");
        }
      });
    }
  });
}


}
