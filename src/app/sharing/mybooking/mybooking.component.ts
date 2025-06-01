import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-mybooking',
  standalone: false,
  templateUrl: './mybooking.component.html',
  styleUrl: './mybooking.component.scss'
})
export class MybookingComponent implements OnInit{

  bookings: any[] = [];
  displayedColumns: string[] = ['username', 'date', 'purpose', 'status'];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private mybooking: BookingService
  ) {}

  ngOnInit(): void {
    this.loadmyBooking();
  }

  loadmyBooking() {
    this.mybooking.getAllMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    })
  }

}
