import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpenspaceService } from '../../service/openspace.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-ussd',
  standalone: false,
  templateUrl: './report-ussd.component.html',
  styleUrl: './report-ussd.component.scss',
  animations: [
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('tableLeaveAnimation', [
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
      ])
    ]),
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
export class ReportUssdComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openspace: OpenspaceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadreportussd();
  }

  loadreportussd() {
    this.openspace.getAllReportUssd().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confirmReport(report: any) {
    const reportId = report.id;

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to confirm this report.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.openspace.ConfirmReportUssd(reportId).subscribe({
          next: () => {
            Swal.fire({
              title: "Confirmed!",
              text: "The report has been confirmed and SMS sent.",
              icon: "success"
            });

            report.status = 'processed';

            this.dataSource.data = [...this.dataSource.data];

          },
          error: (err) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to confirm the report.",
              icon: "error"
            });
            console.error(err);
          }
        });
      }
    });
  }




}
