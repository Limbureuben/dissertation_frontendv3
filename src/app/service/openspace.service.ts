import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ADD_OPENSPACE, DELETE_OPEN_SPACE, GET_ALL_OPENSPACES, GET_ALL_OPENSPACES_ADMIN, GET_ALL_OPENSPACES_USER, GET_MESSAGE_COUNT, TOGGLE_OPENSPACE_STATUS } from '../graphql';


export interface OpenSpaceRegisterData{
  name: string,
  latitude: number,
  longitude: number,
  district: string
}

export interface ToggleOpenSpaceResponse {
  toggleOpenspaceStatus: {
    openspace: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      district: string;
      isActive: boolean;
    };
  };
}


@Injectable({
  providedIn: 'root'
})
export class OpenspaceService {
  private openSpacesSubject = new BehaviorSubject<any[]>([]);
  openSpaces$ = this.openSpacesSubject.asObservable();

  constructor(private apollo: Apollo) {
    this.loadOpenSpaces();
  }

  // addSpace(openData: OpenSpaceRegisterData): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: ADD_OPENSPACE,
  //     variables: {
  //       name: openData.name,
  //       latitude: openData.latitude,
  //       longitude: openData.longitude,
  //       district: openData.district
  //     }
  //   })
  // }

  addSpace(openData: OpenSpaceRegisterData): Observable<any> {
    return this.apollo.mutate<{ addOpenSpace: any }>({
      mutation: ADD_OPENSPACE,
      variables: {
        name: openData.name,
        latitude: openData.latitude,
        longitude: openData.longitude,
        district: openData.district
      },
      update: (cache) => {
        const existingCount: any = cache.readQuery({ query: GET_MESSAGE_COUNT });
        cache.writeQuery({
          query: GET_MESSAGE_COUNT,
          data: { totalOpenspaces: (existingCount?.totalOpenspaces || 0) + 1 },
        });
      }
    });
  }

  // getAllOpenSpaces(): Observable<any> {
  //   return this.apollo
  //     .watchQuery({
  //       query: GET_ALL_OPENSPACES
  //     })
  //     .valueChanges.pipe(map((result: any) => result.data.allOpenSpaces));
  // }
  getAllOpenSpacesUser(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ allOpenSpacesUser: any[] }>({
        query: GET_ALL_OPENSPACES_USER,
      })
      .valueChanges.pipe(map((result) => result.data.allOpenSpacesUser));
  }

  getAllOpenSpacesAdmin(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ allOpenSpacesAdmin: any[] }>({
        query: GET_ALL_OPENSPACES_ADMIN,
      })
      .valueChanges.pipe(map((result) => result.data.allOpenSpacesAdmin));
  }

  loadOpenSpaces() {
    this.apollo.watchQuery({ query: GET_ALL_OPENSPACES }).valueChanges.pipe(
      map((result: any) => result.data.allOpenSpaces)
    ).subscribe((data) => {
      this.openSpacesSubject.next(data);
    });
  }

  // getOpenSpaces(): Observable<any[]> {
  //   return this.openSpaces$;
  // }
  getOpenSpaces(): Observable<any[]> {
    return this.apollo.watchQuery<{ allOpenSpaces: any[] }>({
      query: GET_ALL_OPENSPACES
    })
    .valueChanges.pipe(map(result => result.data.allOpenSpaces));
  }

  deleteOpenSpace(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_OPEN_SPACE,
      variables: { id },
      update: (cache) => {
        const existingData: any = cache.readQuery({ query: GET_ALL_OPENSPACES });
        cache.writeQuery({
          query: GET_ALL_OPENSPACES,
          data: {
            allOpenSpaces: existingData.allOpenSpaces.filter((space: any) => space.id !== id),
          },
        });
      },
    });
  }

  getOpenspaceCount(): Observable<any> {
    return this.apollo.watchQuery<{ totalOpenspaces: number }>({
      query: GET_MESSAGE_COUNT,
    }).valueChanges;
  }

  toggleOpenSpaceStatus(id: string, isActive: boolean): Observable<any> {
    return this.apollo.mutate<ToggleOpenSpaceResponse>({
      mutation: TOGGLE_OPENSPACE_STATUS,
      variables: { input: { id, isActive } }
    }).pipe(
      map(result => result.data?.toggleOpenspaceStatus?.openspace)
    );
  }

}