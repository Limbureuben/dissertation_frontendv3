import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, tap } from 'rxjs';
import { GET_USER_PROFILE, LOGIN_USER, LOGIN_USER_AGAIN, LOGIN_USER_MUTATION, REGISTER_MUTATION, REGISTER_USER } from '../graphql';
import { LoginData, RegisterData } from '../models/openspace.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { match } from 'assert';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

  export type { RegisterData, LoginData };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apollo: Apollo,
    private router: Router,
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
    const sessionId = localStorage.getItem('sessionId');

    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        username: userData.username,
        sessionId: sessionId ? sessionId : null,
        ...(userData.role ? { role: userData.role } : {})
      }
    });
  }

  signinUser(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_USER_AGAIN,
      variables: {
        username,
        password
      }
    });
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.put<any>('http://localhost:8000/api/v1/upload-profile-image/', formData);
  }





  // registrationUser(userData: RegisterData): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: REGISTER_MUTATION,
  //     variables: {
  //       password: userData.password,
  //       passwordConfirm: userData.passwordConfirm,
  //       username: userData.username,
  //       ...(userData.role ? { role: userData.role } : {})
  //     }
  //   });
  // }

  // signinUser(username: string, password: string): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: LOGIN_USER_MUTATION,
  //     variables: {
  //       username,
  //       password
  //     }
  //   });
  // }



  Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('lastRoute');

    this.toast.success('Logout successful!', 'Success', {
      positionClass: 'toast-top-right',
      progressBar: true
    });
    this.router.navigate(['/user-home']);
  }

  isLoggedIn(): boolean {
    const accessToken = localStorage.getItem('success_token');
    console.log('Access Token:', accessToken);
    return !!accessToken;
  }

  generateSessionId(): string {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/profile/');
  }

}
function throwError(arg0: () => Error): any {
  throw new Error('Function not implemented.');
}




