import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LOGIN_USER, REGISTER_USER } from '../graphql';
import { RegisterData } from '../models/openspace.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apollo: Apollo
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        email: userData.email,
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
}
