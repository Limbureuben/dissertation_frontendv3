import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success',
  standalone: false,
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  // @Input() title: string = 'Thank You!';
  // @Input() message: string = 'Your details has been successfully submitted. Thanks!';
  // @Output() closePopup = new EventEmitter<void>();


  constructor(private dialogRef: MatDialogRef<SuccessComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
