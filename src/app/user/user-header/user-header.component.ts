import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../theme/theme.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportFormComponent } from '../report-form/report-form.component';
import { AnonymousreportComponent } from '../anonymousreport/anonymousreport.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent implements OnInit{
  isDarkTheme = false;
  isAuthenticated = false;
  isAnonymous: boolean = false;

  constructor(
    private themeService: ThemeService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
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

  // ngOnInit() {
  //   this.isAuthenticated = this.authService.isLoggedIn();
  //   console.log('User authenticated:', this.isAuthenticated);
  // }

  ngOnInit() {
    const accessToken = localStorage.getItem('success_token');
    const userId = localStorage.getItem('user_id'); // Fetch user ID
    const isStaff = localStorage.getItem('is_staff') === 'true';

    this.isAuthenticated = !!accessToken && !!userId; // Authenticated only if token & user ID exist
    this.isAnonymous = !this.isAuthenticated; // Anonymous if no valid login

    console.log('Access Token:', accessToken);
    console.log('User ID:', userId);
    console.log('Is Staff:', isStaff);
    console.log('User authenticated:', this.isAuthenticated);
    console.log('Anonymous user:', this.isAnonymous);
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

  onRegister() {

  }
}
