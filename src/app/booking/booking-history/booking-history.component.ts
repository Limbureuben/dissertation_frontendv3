import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-booking-history',
  standalone: false,
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.scss',
  animations: [
      // Table Pop-up Animation
      trigger('popupAnimation', [
        transition(':enter', [
          style({ transform: 'scale(0.5)', opacity: 0 }),
          animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 }))
        ])
      ]),

      // Table Row Animation
      trigger('rowAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
  })
export class BookingHistoryComponent {
  showReportHistory = true;


  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<BookingHistoryComponent>,
    private toastr: ToastrService,
    private bookingservice: BookingService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
      this.loadReport()
  }

  loadReport() {
    this.bookingservice.getAllMyHistoryBooking().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closeReportHistoryDialog() {
    this.dialogRef.close();
  }

  closeTable() {
    this.showReportHistory = false; // Hide when close button is clicked
  }

}
