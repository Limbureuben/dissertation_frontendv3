import { Component } from '@angular/core';
import { ThemeService } from '../../../theme/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFormComponent } from '../report-form/report-form.component';
import { AnonymousreportComponent } from '../anonymousreport/anonymousreport.component';

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
    public dialog: MatDialog
  ) {}

  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportFormComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openReport(): void {
    const dialogRef = this.dialog.open(AnonymousreportComponent, {
      width: '1000px'
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
    console.log('Logout clicked');

  }

  closeReportForm() {

  }

}
