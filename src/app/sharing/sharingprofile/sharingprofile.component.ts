import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../service/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sharingprofile',
  standalone: false,
  templateUrl: './sharingprofile.component.html',
  styleUrl: './sharingprofile.component.scss',
  animations: [
    trigger('dialogFadeIn', [
      transition(':enter', [ // when component enters the DOM
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class SharingprofileComponent {

  constructor(
    private userService: AuthService,
    private dialogRef: MatDialogRef<SharingprofileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  

}
