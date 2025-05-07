import { Component, Inject, OnInit } from '@angular/core';
import { error } from 'console';
import { AuthService } from '../../service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user: any;
  houseCount: number = 0;

  constructor(
    private userService: AuthService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  resetPassword() {
    this.dialogRef.close();
    this.router.navigate(['/forgot-password']);
  }
}
