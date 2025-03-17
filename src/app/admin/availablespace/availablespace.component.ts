// import { loadOpenSpaces } from './../../RGX/open-space.actions';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { OpenSpace } from '../../State/open-space.model';
import * as OpenSpaceActions from '../../State/open-space.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-availablespace',
  standalone: false,
  templateUrl: './availablespace.component.html',
  styleUrl: './availablespace.component.scss'
})
export class AvailablespaceComponent implements OnInit{

  // dataSource = new MatTableDataSource<OpenSpace>();

  // openSpaces$!: Observable<OpenSpace[]>;
  // openSpaces: any[] = [];
  // loading = true;
  // error: string | null = null;
  displayedColumns: string[] = ['name', 'district', 'latitude', 'longitude', 'actions']; // Define displayed columns
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
    // private store: Store<{ openSpaces: OpenSpace[] }>
  ) {}

 
  ngOnInit() {
    // Subscribe to the observable for automatic updates
    this.openSpaceService.getOpenSpaces().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteOpenSpace(id: string) {
    this.openSpaceService.deleteOpenSpace(id).subscribe(() => {
      // Filter the data source after deletion
      this.dataSource.data = this.dataSource.data.filter(space => space.id !== id);
      this.toastr.success('Open spac deleted successfully!', 'Success', {
        positionClass: 'toast-top-right',
      })
    });
  }



  editOpenSpace() {

  }

//   deleteOpenSpace(id: string): void {
//     console.log("Deleting OpenSpace with ID:", id); // Debugging log

//     this.openSpaceService.deleteOpenSpace(id).subscribe({
//       next: (response) => {
//         if(response.data.deleteOpenSpace.success) {
//           this.toastr.success('OpenSpace deleted successfully!', 'Success', {
//             positionClass: 'toast-top-right',
//           });
//           this.openSpaces = this.openSpaces.filter((space) => space.id !== id);
//         } else {
//           this.toastr.error('OpenSpace delete failed!', 'Error', {
//             positionClass: 'toast-top-right',
//           });
//         }
//       },
//       error: () => {
//         this.toastr.error('An error occurred while deleting OpenSpace!', 'Error', {
//           positionClass: 'toast-top-right',
//         });
//       }
//     });
// }


}
