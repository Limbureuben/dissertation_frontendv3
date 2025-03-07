import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  showForm = false;  // Boolean to control visibility

  toggleForm() {
    this.showForm = !this.showForm; // Toggle form visibility
  }

  close() {
    this.showForm = false; // Close the form
  }

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  // Password strength validation
  passwordStrengthValidator(control: any) {
    const value = control.value;
    if (!value) return { weakPassword: true };

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength) {
      return null;
    }
    return { weakPassword: true };
  }

  // Custom validator to check if passwords match
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      if (this.registerForm.errors?.['passwordMismatch']) {
        this.toastr.error('Passwords do not match!', 'Validation Error', { positionClass: 'toast-top-right' });
      } else {
        this.toastr.error('Enter valid values', 'Validation Error', { positionClass: 'toast-top-right' });
      }

      return;
    }

    const registrationData: RegisterData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      passwordConfirm: this.registerForm.value.passwordConfirm
    };

    console.log("Data being sent to mutation:", registrationData);

    this.authservice.registrationUser(registrationData).subscribe({
      next: (result) => {
        console.log('GraphQL Response:', result);
        const response = result.data.registerUser.output;

        if (response.success) {
          this.toastr.success(response.message, 'Success', { positionClass: 'toast-top-right' });

          // Reset the form after success
          this.registerForm.reset();

          // Redirect to login after a short delay
          this.router.navigate(['/login']);
        } else {
          if (response.message.includes('username')) {
            this.toastr.error('Username already exists. Try another.', 'Registration Failed', { positionClass: 'toast-top-right' });
          } else if (response.message.includes('email')) {
            this.toastr.error('Email is already taken.', 'Registration Failed', { positionClass: 'toast-top-right' });
          } else {
            this.toastr.error(response.message, 'Registration Failed', { positionClass: 'toast-top-right' });
          }
        }
      },
      error: (err) => {
        console.error('GraphQL Error:', err);

        if (err.message.includes('username')) {
          this.toastr.error('Username already exists. Try another.', 'Error', { positionClass: 'toast-top-right' });
        } else if (err.message.includes('email')) {
          this.toastr.error('Email is already registered. Use a different email.', 'Error', { positionClass: 'toast-top-right' });
        } else {
          this.toastr.error('Something went wrong. Please try again.', 'Error', { positionClass: 'toast-top-right' });
        }
      }
    });
  }

}
