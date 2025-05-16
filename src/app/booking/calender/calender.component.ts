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
    height: 500
    // eventDidMount will be conditionally assigned
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    // Only assign tooltip logic if in the browser
    if (typeof document !== 'undefined') {
      this.calendarOptions.eventDidMount = this.handleEventTooltip.bind(this);
    }

    this.bookingService.getBookedSpaces().subscribe(bookings => {
      const groupedByDate: { [key: string]: any[] } = {};

      // Group bookings by date
      bookings.forEach(b => {
        if (!groupedByDate[b.date]) {
          groupedByDate[b.date] = [];
        }
        groupedByDate[b.date].push(b);
      });

      // Map to FullCalendar event format
      const events = Object.entries(groupedByDate).map(([date, bookingsOnDate]) => ({
        title: '', // No text shown on calendar cell
        date,
        color: '#4CAF50', // Always green (or use getColorByStatus if needed)
        extendedProps: {
          bookings: bookingsOnDate
        }
      }));

      this.calendarOptions.events = events;
    });
  }

  handleEventClick(info: any) {
    const { start, extendedProps } = info.event;
    const bookings = extendedProps.bookings || [];

    const message = bookings.map((b: any, i: number) => (
      `${i + 1}. ${b.username} (Contact: ${b.contact}, Purpose: ${b.purpose})`
    )).join('\n');

    alert(
      `Bookings on ${start.toDateString()}:\n\n${message || 'No details available.'}`
    );
  }

  handleEventTooltip(info: any) {
    // Avoid SSR issues: make sure this only runs in browser
    if (typeof document !== 'undefined') {
      const tooltip = document.createElement('div');
      tooltip.innerHTML = 'Booked'; // You can customize this
      tooltip.className = 'fc-tooltip';
      info.el.setAttribute('title', tooltip.textContent || '');
    }
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
