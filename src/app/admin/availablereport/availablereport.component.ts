import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ViewReportComponent } from '../view-report/view-report.component';

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
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
      this.loadReport()
  }

  loadReport() {
    this.openSpaceService.getAllReports().subscribe((data) => {
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

  confirmReport(reportId: string): void {
    this.openSpaceService.confirmReport(reportId).subscribe(response => {
      if (response.data.confirmReport.success) {
        this.toastr.success(response.data.confirmReport.message, 'Success', {
          positionClass: 'toast-top-right',
        });

        this.loadReport();
      } else {
        this.toastr.error('Failed to confirm report', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    }, error => {
      this.toastr.error('Error confirming report', 'Error');
    }
  )
  }

  markAsPending(reportId: string): void {
    console.log('Deleting Report:', reportId);
  }

  viewReport(report: any): void {
    this.dialog.open(ViewReportComponent, {
      data: report,
    });
}
}