import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ADD_OPENSPACE, DELETE_OPEN_SPACE, GET_ALL_OPENSPACES, GET_ALL_OPENSPACES_ADMIN, GET_ALL_OPENSPACES_USER, GET_OPENSPACE_COUNT, REGISTER_REPORT_MUTATION, TOGGLE_OPENSPACE_STATUS } from '../graphql';
import { OpenSpaceRegisterData, ToggleOpenSpaceResponse } from '../models/openspace.model';
import { HttpClient } from '@angular/common/http';

export type { OpenSpaceRegisterData, ToggleOpenSpaceResponse };


@Injectable({
  providedIn: 'root'
})
export class OpenspaceService {

  private fileUploadUrl = 'http://127.0.0.1:8000/api/v1/upload/';
  private openSpacesSubject = new BehaviorSubject<any[]>([]);
  openSpaces$ = this.openSpacesSubject.asObservable();

  constructor(private apollo: Apollo, private http: HttpClient,) {
    this.loadOpenSpaces();
  }

  addSpace(openData: OpenSpaceRegisterData): Observable<any> {
    return this.apollo.mutate<{ addOpenSpace: { openspace: any } }>({
      mutation: ADD_OPENSPACE,
      variables: {
        name: openData.name,
        latitude: openData.latitude,
        longitude: openData.longitude,
        district: openData.district
      },
      refetchQueries: [
        { query: GET_ALL_OPENSPACES_ADMIN }, //regresh list ya admin
        { query: GET_OPENSPACE_COUNT } //refresh list ya number
      ]
    });
  }


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
    this.apollo.watchQuery({ query: GET_ALL_OPENSPACES_ADMIN }).valueChanges.pipe(
      map((result: any) => result.data.allOpenSpacesAdmin)
    ).subscribe((data) => {
      this.openSpacesSubject.next(data);
    });
  }

  getOpenSpaces(): Observable<any[]> {
    return this.apollo.watchQuery<{ allOpenSpacesAdmin: any[] }>({
      query: GET_ALL_OPENSPACES_ADMIN,
    })
    .valueChanges.pipe(map(result => result.data.allOpenSpacesAdmin));
  }

  deleteOpenSpace(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_OPEN_SPACE,
      variables: { id },
      update: (cache) => {
        // Update the list of open spaces
        const existingData: any = cache.readQuery({ query: GET_ALL_OPENSPACES_ADMIN });
        if (existingData) {
          cache.writeQuery({
            query: GET_ALL_OPENSPACES_ADMIN,
            data: {
              allOpenSpacesAdmin: existingData.allOpenSpacesAdmin.filter((space: any) => space.id !== id),
            },
          });
        }
        // Update the open space count
        const existingCountData: any = cache.readQuery({ query: GET_OPENSPACE_COUNT });
        if (existingCountData) {
          cache.writeQuery({
            query: GET_OPENSPACE_COUNT,
            data: {
              totalOpenspaces: Math.max(0, existingCountData.totalOpenspaces - 1), // Decrease count
            },
          });
        }
      },
    });
  }


  getOpenspaceCount(): Observable<any> {
    return this.apollo.watchQuery<{ totalOpenspaces: number }>({
      query: GET_OPENSPACE_COUNT,
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

  registerReport(description: string, email: string): Observable<any> {
    return this.apollo.mutate({
      mutation: REGISTER_REPORT_MUTATION,
      variables: { description, email}
    });
  }

  uploadFile(reportId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_id', reportId);

    return this.http.post(this.fileUploadUrl, formData);
  }

}