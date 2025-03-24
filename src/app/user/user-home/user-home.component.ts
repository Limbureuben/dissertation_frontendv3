import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent {
  showPopup: boolean = false;
  menuOpen: boolean = false;
  showHistoryPopup = false;
  dialogRef: any;

  constructor(private router: Router, private authservice: AuthService, private dialog: MatDialog ) {}

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


    // openReportHistoryDialog() {
    //   this.dialog.open(ViewHistoryComponent, {
    //     width: '80%', // Adjust width as needed
    //     height: '80%', // Adjust height as needed
    //     disableClose: false // Allows user to close the dialog
    //   });
    // }

    openReportHistoryDialog() {
      if (!this.dialogRef || this.dialogRef.getState() === 2) {
        this.dialogRef = this.dialog.open(ViewHistoryComponent, {
          width: '800px',
          height: '600px',
          disableClose: false
        });

        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null; // Reset when dialog is closed
        });
      }
    }

}
