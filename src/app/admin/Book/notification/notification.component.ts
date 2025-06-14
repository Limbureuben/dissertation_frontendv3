import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NotificationComponent>,
  ) {
    this.form = this.fb.group({
      message: ['', Validators.required]
    })
  }

  onSubmit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
       this.toastr.error('Enter valid values', 'Validation Error', { positionClass: 'toast-top-right' });
       return;
    }
  }





}
