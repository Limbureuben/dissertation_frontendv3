import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private resetService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isSubmitting = true;
    const email = this.resetForm.value.email;

    this.resetService.sendResetLink(email).subscribe({
      next: () => {
        alert('✅ Password reset link sent. Please check your email.');
        this.resetForm.reset();
        this.isSubmitting = false;
      },
      error: () => {
        alert('❌ Failed to send reset link. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}

