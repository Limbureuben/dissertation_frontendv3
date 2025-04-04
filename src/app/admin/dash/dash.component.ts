import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dash',
  standalone: false,
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss',
  animations: [
      trigger('listAnimation', [
        transition(':enter', [
          query('.stat-card', [
            style({ opacity: 0, transform: 'scale(0.8)' }),
            stagger(200, [
              animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
          ], { optional: true })
        ])
      ])
    ]
})
export class DashComponent {

}
