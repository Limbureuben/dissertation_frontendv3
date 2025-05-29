import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-booking',
  standalone: false,
  templateUrl: './confirm-booking.component.html',
  styleUrl: './confirm-booking.component.scss'
})
export class ConfirmBookingComponent {

  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.description.trim()) {
      this.dialogRef.close(this.description.trim());
    }
  }



}
