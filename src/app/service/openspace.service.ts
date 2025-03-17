import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ADD_OPENSPACE, DELETE_OPEN_SPACE, GET_ALL_OPENSPACES, GET_MESSAGE_COUNT } from '../graphql';


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
      }
    }).pipe(
      tap(({ data }) => {
        if (data && data.addOpenSpace) {
          const newSpace = data.addOpenSpace;
          const updatedSpaces = [...this.openSpacesSubject.value, newSpace];
          this.openSpacesSubject.next(updatedSpaces);
        }
      })
    );
  }

  
  getAllOpenSpaces(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: GET_ALL_OPENSPACES
      })
      .valueChanges.pipe(map((result: any) => result.data.allOpenSpaces));
  }

  loadOpenSpaces() {
    this.apollo.watchQuery({ query: GET_ALL_OPENSPACES }).valueChanges.pipe(
      map((result: any) => result.data.allOpenSpaces)
    ).subscribe((data) => {
      this.openSpacesSubject.next(data);
    });
  }

  getOpenSpaces(): Observable<any[]> {
    return this.openSpaces$;
  }

  // getOpenSpaces(): Observable<any> {
  //   return this.apollo.watchQuery({ query: GET_ALL_OPENSPACES }).valueChanges.pipe(
  //     map((result: any) => {
  //       return result.data.allOpenSpaces;
  //     })
  //   );
  // }

  // deleteOpenSpace(id: string): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: DELETE_OPEN_SPACE,
  //     variables: {id},
  //   })
  // }

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
}