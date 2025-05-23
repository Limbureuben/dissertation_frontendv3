import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

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
export class BookingdashboardComponent {

  generatePDF() {
  // Replace with your actual PDF generation logic
  console.log("Generating booking PDF...");
  // Example: this.bookingService.generatePDF();
}


}
