import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../service/booking.service';

@Component({
  selector: 'app-bookingdashboard',
  standalone: false,
  templateUrl: './bookingdashboard.component.html',
  styleUrl: './bookingdashboard.component.scss',
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.dashboard-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BookingdashboardComponent implements OnInit {

  recentBookings = [
    { username: 'Alice', date: new Date(), purpose: 'Meeting', status: 'Confirmed' },
    { username: 'Bob', date: new Date(), purpose: 'Event', status: 'Pending' },
    { username: 'Charlie', date: new Date(), purpose: 'Workshop', status: 'Cancelled' }
  ];

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

      

    })
  }


}
