import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterWardComponent } from '../register-ward/register-ward.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BookingService } from '../../../service/booking.service';
import { NotificationComponent } from '../notification/notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-managewardexecutive',
  standalone: false,
  templateUrl: './managewardexecutive.component.html',
  styleUrl: './managewardexecutive.component.scss',
  animations: [
    trigger('tableEnterAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
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
export class ManagewardexecutiveComponent implements OnInit{

  displayedColumns: string[] = ['ward', 'name', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private wardexecutive: BookingService,
    private snackBar: MatSnackBar,
  ) {}

  openRegisterForm() {

    const dialogRef = this.dialog.open(RegisterWardComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Register form data:', result);
      }
    });
  }

  ngOnInit() {
    this.wardexecutive.getAllExecutives().subscribe((data) =>{
      this.dataSource.data =data;
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

  sendNotificationToAllAdmins(userEmail: string) {
    const dialogRef = this.dialog.open(NotificationComponent, {
    width: '400px',
    data: { email: userEmail }
  });

  // dialogRef.afterClosed().subscribe(message => {
  //   if (message) {
  //     this.wardexecutive.sendNotificationToAllWardExecutives(message).subscribe({
  //       next: () => this.snackBar.open('Notification sent successfully', 'Close', { duration: 3000 }),
  //       error: () => this.snackBar.open('Failed to send notification', 'Close', { duration: 3000 })
  //     });
  //   }
  // });
  }

  sendNotificationToUser(user: any) {

  }

  toggleStatus(user: any) {

}

deleteUser(user: any) {

}

}
