import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dash',
  standalone: false,
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss',
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
export class DashComponent {

}
