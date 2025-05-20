import { Injectable } from '@angular/core';
import { GET_ALL_EXECUTIVE, GET_BOOKED_SPACES, REGISTER_USER } from '../graphql';
import { map, Observable } from 'rxjs';
import { RegisterData } from '../models/openspace.model';
import { Apollo } from 'apollo-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private resetUrl = 'http://localhost:8000';

  constructor(
    private apollo: Apollo,
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
          sessionId: sessionId ? sessionId : null
        }
      });
    }

    getAllExecutives(): Observable<any> {
      return this.apollo.watchQuery<any>({
        query: GET_ALL_EXECUTIVE
      }).valueChanges.pipe(map(result => result.data.wardExectives))
    }

    bookOpenSpace(data: FormData): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.resetUrl}/api/v1/book-open-space/`, data, { headers });
    }

    getAllBookings() {

    }

    getBookedSpaces() {
    return this.apollo
      .watchQuery<any>({
        query: GET_BOOKED_SPACES
      })
      .valueChanges.pipe(
        map(result => result.data.bookedOpenspace)
      );
  }

  getBookingsByDistrict(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.resetUrl}/api/v1/district-bookings/`, { headers });
  }

}
