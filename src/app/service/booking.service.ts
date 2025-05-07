import { Injectable } from '@angular/core';
import { GET_ALL_EXECUTIVE, REGISTER_USER } from '../graphql';
import { map, Observable } from 'rxjs';
import { RegisterData } from '../models/openspace.model';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private apollo: Apollo
  ) { }

  registrationUser(userData: RegisterData): Observable<any> {
      const sessionId = localStorage.getItem('sessionId');

      return this.apollo.mutate({
        mutation: REGISTER_USER,
        variables: {
          password: userData.password,
          passwordConfirm: userData.passwordConfirm,
          username: userData.username,
          sessionId: sessionId ? sessionId : null
        }
      });
    }

    getAllExecutives(): Observable<any> {
      return this.apollo.watchQuery<any>({
        query: GET_ALL_EXECUTIVE
      }).valueChanges.pipe(map(result => result.data.wardExectives))
    }
}
