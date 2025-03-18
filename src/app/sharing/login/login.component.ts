import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../service/language.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('2000ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit{

  LoginForm!: FormGroup;
  registrationError: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private auth: Auth
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

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }


  OnSubmit() {
    if(!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return;
    }

    const {username, password}: LoginData = this.LoginForm.value;

    this.authservice.signinUser(username, password).subscribe(
      (result) => {
        if(result.data?.loginUser.success) {
          const user = result.data.loginUser.user;

          localStorage.setItem('success_token', user.accessToken);
          localStorage.setItem('refresh_token', user.refreshToken);

          this.toastr.success('Login successful!', 'Success', {
            positionClass: 'toast-top-right',
          });

          if(user.isStaff) {
            this.router.navigate(['/admindashboard'])
            return;
          }
          if(user.emailVerified) {
            this.router.navigate(['/map-display']);
          }
        } else {
          this.registrationError = result.data?.loginUser?.message || 'Login failed';
          this.toastr.error(this.registrationError);
          this.showFailure(this.registrationError);
        }
      },
      (error) => {
       this.registrationError = error;
       this.toastr.error('Login failed');
      }
    )
  }

  showFailure(message: string) {
    console.error('Login Error:', message);
  }
}
function loginWithGoogle() {
  throw new Error('Function not implemented.');
}

