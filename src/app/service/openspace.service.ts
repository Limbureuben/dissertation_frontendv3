import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ADD_OPENSPACE, DELETE_OPEN_SPACE, GET_ALL_OPENSPACES } from '../graphql';


export interface OpenSpaceRegisterData{
  name: string,
  latitude: number,
  longitude: number,
  district: string
}

@Injectable({
  providedIn: 'root'
})
export class OpenspaceService {

  constructor(private apollo: Apollo) { }

  addSpace(openData: OpenSpaceRegisterData): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_OPENSPACE,
      variables: {
        name: openData.name,
        latitude: openData.latitude,
        longitude: openData.longitude,
        district: openData.district
      }
    })
  }

  getAllOpenSpaces(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: GET_ALL_OPENSPACES
      })
      .valueChanges.pipe(map((result: any) => result.data.allOpenSpaces));
  }

  getOpenSpaces(): Observable<any> {
    return this.apollo.watchQuery({ query: GET_ALL_OPENSPACES }).valueChanges.pipe(
      map((result: any) => result.data.allOpenSpaces)
    );
  }

  deleteOpenSpace(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_OPEN_SPACE,
      variables: {id},
    })
  }
}