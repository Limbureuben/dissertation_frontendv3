import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface OpenSpaceRegisterData{
  name: string,
  latitude: number,
  longitude: number,
  district: string
}

export const ADD_OPENSPACE = gql`
  mutation AddOpenSpace($name: String!, $latitude: Float!, $longitude: Float!, $district: String!) {
    addSpace(input: { name: $name, latitude: $latitude, longitude: $longitude, district: $district }) {
      openspace {
        name
        latitude
        longitude
        district
      }
      output {
        message
        success
        openspace {
          name
          latitude
          longitude
          district
        }
      }
    }
  }
`;

export const GET_ALL_OPENSPACES = gql`
  query {
    allOpenSpaces {
      name
      longitude
      latitude
      district
    }
  }
`;

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

}