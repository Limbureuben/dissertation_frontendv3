import { SharingprofileComponent } from './../sharingprofile/sharingprofile.component';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../../service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private router: Router,
    public dialog: MatDialog,
  ) {}

  OnProfile() {
  const dialogRef = this.dialog.open(SharingprofileComponent, {
        width: '400px',
        disableClose: false
      })
    }
}

