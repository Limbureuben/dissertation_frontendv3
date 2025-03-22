import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {
  showPopup: boolean = false;
  menuOpen: boolean = false;

  constructor(private router: Router, private authservice: AuthService ) {}

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

  // continueAsAnonymous(): void {
  //   this.showPopup = false;
  //   this.authservice.generateSessionId();

  //   this.router.navigate(['/map-display'])
  // }

  continueAsAnonymous(): void {
    this.showPopup = false;

    let sessionID = localStorage.getItem('session_id');
    if (!sessionID) {
      this.authservice.generateSessionId();
      sessionID = localStorage.getItem('session_id');
    }
    if(sessionID) {
      this.router.navigate(['/map-display'])
    }
    else {
      console.error('Failed to create session ID');
    }
  }

  @ViewChild('chatbotContainer') chatbotContainer!: ElementRef;

    openChat() {
      if (this.chatbotContainer) {
        this.chatbotContainer.nativeElement.style.display = 'block';
        if ((window as any).eapps) {
          (window as any).eapps.init();
        }
      }
    }


}
