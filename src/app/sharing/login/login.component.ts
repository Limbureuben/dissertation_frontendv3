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
    this.languageService.changeLanguage(language);
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  }


//   OnSubmit() {
//     if (!this.LoginForm.valid) {
//         this.LoginForm.markAllAsTouched();
//         return;
//     }

//     const { username, password }: LoginData = this.LoginForm.value;

//     this.authservice.signinUser(username, password).subscribe(
//         (result) => {
//             if (result.data?.loginUser.success) {
//                 const user = result.data.loginUser.user;

//                 localStorage.setItem('user_id', user.id);

//                 localStorage.setItem('success_token', user.accessToken);
//                 localStorage.setItem('refresh_token', user.refreshToken);
//                 localStorage.setItem('is_staff', user.isStaff ? 'true' : 'false');

//                 const accessToken = localStorage.getItem('success_token');
//                 const refreshToken = localStorage.getItem('refresh_token');

//                 if (accessToken && refreshToken) {
//                     console.log('Tokens successfully stored!');
//                 } else {
//                     console.error('Failed to store tokens');
//                 }

//                 console.log('User ID stored:', user.id);

//                 this.toastr.success('Login successful!', 'Success', {
//                     positionClass: 'toast-top-right',
//                 });

//                 if (user.isStaff) {
//                     this.router.navigate(['/admindashboard']);
//                     return;
//                 }
//                 if (user) {
//                     this.router.navigate(['/map-display']);
//                 }
//             } else {
//                 this.registrationError = result.data?.loginUser?.message || 'Login failed';
//                 this.toastr.error(this.registrationError);
//                 this.showFailure(this.registrationError);
//             }
//         },
//         (error) => {
//             this.registrationError = error;
//             this.toastr.error('Login failed');
//         }
//     );
// }

OnSubmit() {
  if (!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return;
  }

  const { username, password }: LoginData = this.LoginForm.value;

  this.authservice.signinUser(username, password).subscribe(
      (result) => {
          if (result.data?.loginUser.success) {
              const user = result.data.loginUser.user;

              if (!user || !user.id || !user.accessToken) {
                  console.error("Login response missing user details!");
                  this.toastr.error("Login failed: Missing user details.");
                  return;
              }

              // Store user details in localStorage
              localStorage.setItem('user_id', user.id.toString()); // Ensure stored as string
              localStorage.setItem('success_token', user.accessToken);
              localStorage.setItem('refresh_token', user.refreshToken);
              localStorage.setItem('is_staff', user.isStaff ? 'true' : 'false');

              // Confirm stored values
              console.log("User ID stored:", localStorage.getItem('user_id'));
              console.log("Access Token stored:", !!localStorage.getItem('success_token'));
              console.log("Refresh Token stored:", !!localStorage.getItem('refresh_token'));

              this.toastr.success('Login successful!', 'Success', {
                  positionClass: 'toast-top-right',
              });

              // Navigate based on user role
              if (user.isStaff) {
                  this.router.navigate(['/admindashboard']);
              } else {
                  this.router.navigate(['/map-display']);
              }
          } else {
              const errorMessage = result.data?.loginUser?.message || 'Login failed';
              console.error("Login Error:", errorMessage);
              this.toastr.error(errorMessage);
              this.showFailure(errorMessage);
          }
      },
      (error) => {
          console.error("Login Request Error:", error);
          this.toastr.error('Login failed. Please check your credentials.');
      }
  );
}



  showFailure(message: string) {
    console.error('Login Error:', message);
  }
}
function loginWithGoogle() {
  throw new Error('Function not implemented.');
}

