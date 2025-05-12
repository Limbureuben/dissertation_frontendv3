import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private resetService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    console.log('Form value:', this.resetForm.value);
    console.log('Form valid?', this.resetForm.valid);

    if (this.resetForm.valid) {
      const email = this.resetForm.get('email')?.value;

      this.resetService.sendResetLink(email).subscribe({
        next: (response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reset link sent to your email',
            showConfirmButton: false,
            timer: 1500
          });
          this.resetForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Failed to send reset link. Please try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please enter a valid email address', 'Close', { duration: 3000 });
    }
  }
}

