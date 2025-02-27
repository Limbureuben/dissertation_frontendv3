import { Component } from '@angular/core';
import { ThemeService } from '../../../theme/theme.service';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
  isReportFormVisible = false;
  isDarkTheme = false;

  constructor(
    private themeService: ThemeService
  ) {}

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
