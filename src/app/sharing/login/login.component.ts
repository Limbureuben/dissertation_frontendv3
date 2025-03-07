import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  LoginForm!: FormGroup;
  registrationError: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
      this.LoginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
  }

  // Method to handle language change
  changeLanguage(language: string) {
    this.languageService.changeLanguage(language);  // Use the LanguageService to change the language
  }


  OnSubmit() {
    if(!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return;
    }

    const {username, password}: LoginData = this.LoginForm.value;

    console.log('data pass here');

    console.log('Mutation taken', {username, password});

    this.authservice.signinUser(username, password).subscribe(
      (result) => {
        if(result.data?.loginUser.success) {
          const user = result.data.loginUser.user;

          localStorage.setItem('success_token', user.accessToken);
          localStorage.setItem('refresh_token', user.refreshToken);

          this.toastr.success('Login successful!', 'Success', {
            positionClass: 'toast-top-right',
          });

          if(user.isSuperuser) {
            this.router.navigate(['/admindashboard'])
            return;
          }
          if(user.emailVerified) {
            this.router.navigate(['/map-display']);
          } else {
            this.toastr.warning('Please verify your email first.');
          }
        } else {
          this.registrationError = result.data?.loginUser?.message || 'Login failed';
          this.toastr.error(this.registrationError);
          this.showFailure(this.registrationError);
        }
      },
      (error) => {
        if (error?.graphQLErrors?.length) {
          const message = error.graphQLErrors[0].message;

          if (message.includes('Email not verified')) {
            // Toast for unverified email
            this.toastr.warning('Please verify your email first.');
          } else {
            // Toast for other errors
            this.toastr.error(message);
          }
        } else {
          // General error fallback
          this.registrationError = 'An error occurred during login.';
          this.toastr.error(this.registrationError);
        }
        this.showFailure(this.registrationError);
      }
    )
  }

  showFailure(message: string) {
    console.error('Login Error:', message);
  }
}
