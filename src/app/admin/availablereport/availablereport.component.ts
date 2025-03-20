import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-availablereport',
  standalone: false,
  templateUrl: './availablereport.component.html',
  styleUrl: './availablereport.component.scss',
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
export class AvailablereportComponent implements OnInit{
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openSpaceService: OpenspaceService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
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
