import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

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

}
