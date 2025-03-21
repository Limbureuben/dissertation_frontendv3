import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ADD_OPENSPACE, CONFIRM_REPORT, CREATE_REPORT, DELETE_OPEN_SPACE, GET_ALL_HISTORY, GET_ALL_OPENSPACES, GET_ALL_OPENSPACES_ADMIN, GET_ALL_OPENSPACES_USER, GET_ALL_REPORTS, GET_HISTORY_COUNT, GET_OPENSPACE_COUNT, GET_REPORT_COUNT, REGISTER_REPORT_MUTATION, TOGGLE_OPENSPACE_STATUS } from '../graphql';
import { OpenSpaceRegisterData, ToggleOpenSpaceResponse } from '../models/openspace.model';
import { HttpClient } from '@angular/common/http';

export type { OpenSpaceRegisterData, ToggleOpenSpaceResponse };


@Injectable({
  providedIn: 'root'
})
export class OpenspaceService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/upload/';
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
        { query: GET_OPENSPACE_COUNT }
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

  uploadFile(file: File | null): Observable<{ file_path: string | null }> {
    if (!file) {
      return of({ file_path: null });
    }

    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ file_path: string }>(this.apiUrl, formData);
  }


  createReport(description: string, email: string | null, filePath: string | null, spaceName: string, latitude: number, longitude: number): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_REPORT,
      variables: {
        description,
        email: email || null,
        filePath: filePath || null,
        spaceName,
        latitude,
        longitude
      }
    }).pipe(
      map(result => result.data)
    );
  }

  getAllReports(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_REPORTS,
    }).valueChanges.pipe(map(result => result.data.allReports));
  }


  // confirmReport(reportId: string): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: CONFIRM_REPORT,
  //     variables: { reportId },
  //     update: (cache) => {
  //       // Read the existing reports from cache
  //       const existingData: any = cache.readQuery({ query: GET_ALL_REPORTS });

  //       if (existingData) {
  //         // Filter out the confirmed report
  //         cache.writeQuery({
  //           query: GET_ALL_REPORTS,
  //           data: {
  //             allReports: existingData.allReports.filter(
  //               (report: any) => report.reportId !== reportId
  //             ),
  //           },
  //         });
  //       }
  //     },
  //   });
  // }

  getAllHistory(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: GET_ALL_HISTORY,
    }).valueChanges.pipe(map(result =>result.data.allHistorys))
  }


  confirmReport(reportId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: CONFIRM_REPORT,
      variables: { reportId },
      refetchQueries: [{ query: GET_ALL_HISTORY }], // Fetch updated history
      update: (cache) => {
        // Update GET_ALL_REPORTS cache to remove confirmed report
        const existingData: any = cache.readQuery({ query: GET_ALL_REPORTS });

        if (existingData) {
          cache.writeQuery({
            query: GET_ALL_REPORTS,
            data: {
              allReports: existingData.allReports.filter(
                (report: any) => report.reportId !== reportId
              ),
            },
          });
        }
      },
    });
  }

  getAllHistoryReport(): Observable<any> {
    return this.apollo.watchQuery<{ totalHistorys: number }> ({
      query: GET_HISTORY_COUNT,
    }).valueChanges;
  }

  getAllReportPending(): Observable<any> {
    return this.apollo.watchQuery<{ totalReport: number }> ({
      query: GET_REPORT_COUNT,
    }).valueChanges;
  }
}