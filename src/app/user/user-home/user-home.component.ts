import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {
  showPopup: boolean = false;
  menuOpen: boolean = false;

  constructor(private router: Router) {}

  OPenBookDasboard() {
    this.router.navigate(['/login'])
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openPopup() {
    this.showPopup = true;
  }


  navigateToCreateAccount() {
    this.showPopup = false;
    this.router.navigate(['/register'])

  }

  navigateToLogin() {
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

  @ViewChild('chatbotContainer') chatbotContainer!: ElementRef;

    openChat() {
      if (this.chatbotContainer) {
        this.chatbotContainer.nativeElement.style.display = 'block';

        // Ensure Elfsight script reloads if needed
        if ((window as any).eapps) {
          (window as any).eapps.init();
        }
      }
    }


}
