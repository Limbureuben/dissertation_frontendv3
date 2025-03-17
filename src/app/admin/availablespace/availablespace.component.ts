// import { loadOpenSpaces } from './../../RGX/open-space.actions';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
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
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-availablespace',
  standalone: false,
  templateUrl: './availablespace.component.html',
  styleUrl: './availablespace.component.scss',
  animations: [
    // Slide table from right when opening
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Animate row additions & deletions
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
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
    this.openSpaceService.getAllOpenSpacesAdmin().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
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

  toggleStatus(space: any) {
    const newStatus = !space.isActive;
    this.openSpaceService.toggleOpenSpaceStatus(space.id, newStatus)
      .subscribe(updatedSpace => {
        const index = this.dataSource.data.findIndex(s => s.id === space.id);
        if (index !== -1) {
          this.dataSource.data[index].isActive = updatedSpace.isActive;
        }
        this.dataSource._updateChangeSubscription();
        this.paginator.firstPage(); // Move back to first page after status update
      });
  }

}
