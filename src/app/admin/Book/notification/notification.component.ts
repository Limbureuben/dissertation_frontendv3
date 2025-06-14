import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../service/booking.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  notificationForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private toastr: ToastrService,
    private fb: FormBuilder,
    private notificationService: BookingService,
    private dialogRef: MatDialogRef<NotificationComponent>,
  ) {
    this.notificationForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.notificationForm.invalid) return;

    const message = this.notificationForm.value.message;
    this.notificationService.sendNotificationToAllWardExecutives(this.data.email, message).subscribe({
      next: () => {
        this.snackBar.open('Notification sent!', 'Close', { duration: 3000 });
        this.dialogRef.close();
      },
      error: () => {
        this.snackBar.open('Failed to send notification.', 'Close', { duration: 3000 });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
