import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { RegisterWardComponent } from '../register-ward/register-ward.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-managewardexecutive',
  standalone: false,
  templateUrl: './managewardexecutive.component.html',
  styleUrl: './managewardexecutive.component.scss',
  animations: [
    // Slide table from right when opening
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Animate row additions & deletions
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class ManagewardexecutiveComponent {
  constructor(private dialog: MatDialog) {}

  openRegisterForm() {

    const dialogRef = this.dialog.open(RegisterWardComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call your service to register ward executive with result data
        console.log('Register form data:', result);
      }
    });

  }

}
