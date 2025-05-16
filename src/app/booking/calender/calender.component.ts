import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { BookingService } from '../../service/booking.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calender',
  standalone: false,
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss'
})
export class CalenderComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: this.handleEventTooltip.bind(this),
    height: 'auto'
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getBookedSpaces().subscribe(bookings => {
      this.calendarOptions.events = bookings.map(b => ({
        title: `Booked by ${b.username}`,
        date: b.date,
        color: this.getColorByStatus(b.status),
        extendedProps: {
          username: b.username,
          contact: b.contact,
          purpose: b.purpose
        }
      }));
    });
  }

  handleEventClick(info: any) {
    const { title, start, extendedProps } = info.event;
    alert(
      `Booking Details:\n\n` +
      `Title: ${title}\n` +
      `Date: ${start.toDateString()}\n` +
      `Purpose: ${extendedProps.purpose}\n` +
      `Contact: ${extendedProps.contact}`
    );
  }

  handleEventTooltip(info: any) {
    const tooltip = document.createElement('div');
    tooltip.innerHTML = info.event.title;
    tooltip.className = 'fc-tooltip';
    info.el.setAttribute('title', tooltip.textContent || '');
  }

  getColorByStatus(status: string): string {
    switch (status) {
      case 'approved': return '#4CAF50'; // green
      case 'pending': return '#FFC107';  // amber
      case 'rejected': return '#F44336'; // red
      default: return '#607D8B';         // grey
    }
  }
}
