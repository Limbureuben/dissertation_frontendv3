import { Component } from '@angular/core';
import { ThemeService } from '../../../theme/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFormComponent } from '../report-form/report-form.component';
import { AnonymousreportComponent } from '../anonymousreport/anonymousreport.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
  isDarkTheme = false;

  constructor(
    private themeService: ThemeService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportFormComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openReportAnonymous(): void {
    const dialogRef = this.dialog.open(AnonymousreportComponent, {
      width: '600px',
      panelClass: 'animated-dialog',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Anonymous report closed')
    });
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeService.enableDarkTheme(this.isDarkTheme);
  }

  onProfile() {
    console.log('Profile clicked');
    // Navigate to profile page if needed
  }

  onYourReport() {
    console.log('Your Report clicked');
    // Navigate to "Your Report" page
  }

  showReportForm(): void {
    this.showReportForm();
  }


  onLogout() {
    localStorage.removeItem('anonymousUser');
    this.toastr.success('Logout successfuly', 'Success', {
      positionClass: 'toast-top-right'
    });
    this.router.navigate(['/user-home']);
  }

  closeReportForm() {

  }
}
