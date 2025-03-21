import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LOGIN_USER, REGISTER_USER } from '../graphql';
import { LoginData, RegisterData } from '../models/openspace.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    this.toast.success('Logout successful!', 'Success', {
      positionClass: 'toast-top-right'
    });
    this.router.navigate(['/'])
  }
}
