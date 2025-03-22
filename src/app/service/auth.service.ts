import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, tap } from 'rxjs';
import { LOGIN_USER, REGISTER_USER } from '../graphql';
import { LoginData, RegisterData } from '../models/openspace.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { match } from 'assert';
import { jwtDecode } from 'jwt-decode';

  export type { RegisterData, LoginData };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apollo: Apollo, private router: Router, private toast: ToastrService
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        username: userData.username
      }
    });
  }

  // registrationUser(userData: RegisterData): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: REGISTER_USER,
  //     variables: {
  //       password: userData.password,
  //       passwordConfirm: userData.passwordConfirm,
  //       username: userData.username
  //     }
  //   }).pipe(
  //     tap((response: any) => {
  //       if (response.data.registerUser.output.success) {
  //         const userId = response.data.registerUser.output.user.id;
  //         localStorage.setItem('userId', userId);
  //         console.log('User registered with ID:', userId);
  //       }
  //     })
  //   );
  // }


  signinUser(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_USER,
      variables: {
        input: {
          username,
          password
        }
      }
    })
  }

  Logout() {
    const accessToken = localStorage.getItem('success_token');
    const refreshToken = localStorage.getItem('refresh_token');

    console.log('Before Logout:');
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    localStorage.removeItem('success_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_staff');

    console.log('After Logout:');
    console.log('Access Token:', localStorage.getItem('success_token')); // Should be null
    console.log('Refresh Token:', localStorage.getItem('refresh_token')); // Should be null


    this.toast.success('Logout successful!', 'Success', {
      positionClass: 'toast-top-right'
    });
    this.router.navigate(['/'])
  }

  // isLoggedIn(): boolean {
  //   const accessToken = localStorage.getItem('success_token');
  //   console.log('Access Token:', accessToken);
  //   return !!accessToken;
  // }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('success_token');
    const isStaff = localStorage.getItem('is_staff'); // Check if admin
    const userId = localStorage.getItem('user_id'); // Check if registered user

    console.log('Access Token:', accessToken);
    console.log('User ID:', userId);
    console.log('Is Staff:', isStaff);

    return !!accessToken && (!!isStaff || !!userId); // Must have a user ID or be staff
  }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('success_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    try {
      const decodedToken: any = jwtDecode(accessToken);
      console.log('Decoded Token:', decodedToken); // Debugging log

      if (decodedToken?.user_id) {
        localStorage.setItem('user_id', String(decodedToken.user_id)); // Store as string
        console.log('Stored user ID:', localStorage.getItem('user_id'));
      } else {
        console.warn('User ID not found in token');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }


  generateSessionId(): string {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }
}
function throwError(arg0: () => Error): any {
  throw new Error('Function not implemented.');
}

