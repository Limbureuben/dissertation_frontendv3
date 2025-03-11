import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {
  showPopup: boolean = false;

  constructor(private router: Router) {}

  OPenBookDasboard() {
    this.router.navigate(['/login'])
  }

  openPopup() {
    this.showPopup = true;
  }

  navigateToCreateAccount() {
    this.showPopup = false;
    this.router.navigate(['/login'])

  }

  closePopup() {
    this.showPopup = false;
  }

  continueAsAnonymous() {
    this.showPopup = false;
    this.router.navigate(['/map-display'])
  }


}
