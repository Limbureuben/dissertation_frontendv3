import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LOGIN_USER, REGISTER_USER } from '../graphql';
import { LoginData, RegisterData } from '../models/openspace.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { match } from 'assert';

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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('success_token');
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
