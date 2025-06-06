import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { OpenspaceService } from '../../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBookingComponent } from '../confirm-booking/confirm-booking.component';
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
  displayedColumns: string[] = ['username', 'date', 'duration', 'status', 'file', 'actions'];
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


  acceptBooking(row: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'rgb(100, 100, 177)',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, accept it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Open dialog for description
      const dialogRef = this.dialog.open(ConfirmBookingComponent, {
        width: '400px',
        data: { booking: row }
      });

      dialogRef.afterClosed().subscribe(description => {
        if (description) {
          this.bookingService.acceptBooking(row.id, description).subscribe(
            response => {
              this.toastr.success('Booking accepted and forwarded.', 'Success');

              this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
            },
            error => {
              console.error('Error accepting booking:', error);
              this.toastr.error('Failed to accept booking.', 'Error');
            }
          );
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

}
