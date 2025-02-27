import { Component } from '@angular/core';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {

  onProfile() {
    console.log('Profile clicked');
    // Navigate to profile page if needed
  }

  onYourReport() {
    console.log('Your Report clicked');
    // Navigate to "Your Report" page
  }

  onReport() {
    console.log('Report clicked');
    // Navigate to "Report" page
  }

  onLogout() {
    console.log('Logout clicked');
    // Implement logout logic
  }
  
}
