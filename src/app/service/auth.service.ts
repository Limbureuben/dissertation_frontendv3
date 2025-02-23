import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';


export interface RegisterData {
  email: string,
  password: string,
  passwordConfirm: string,
  username: string,
}

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirm: String!, $username: String!) {
    registerUser(input: { email: $email, password: $password, passwordConfirm: $passwordConfirm, username: $username }) {
      output {
        message
        success
        user {
          id
          email
          username
        }
      }
    }
  }
`;


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
}
