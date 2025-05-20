import { Component, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AvailableBookingComponent } from '../available-booking/available-booking.component';

@Component({
  selector: 'app-ward-booking',
  standalone: false,
  templateUrl: './ward-booking.component.html',
  styleUrl: './ward-booking.component.scss'
})
export class WardBookingComponent implements OnInit{
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['space', 'username', 'contact', 'date', 'duration', 'purpose', 'district', 'file', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
  this.loadBookings();
  }

loadBookings() {
    this.bookingService.getBookingsByDistrict().subscribe((data) => {
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
    this.dialog.open(AvailableBookingComponent, {
      data: report,
    });
  }

  confirmReport(reportId: number): void {
    // Optional: Implement if you want ward executives to confirm bookings
    console.log('Confirming booking:', reportId);
  }

}
