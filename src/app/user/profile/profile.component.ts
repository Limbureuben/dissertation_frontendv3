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
  selectedFile: File | null = null;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profile_image', this.selectedFile);

      this.userService.uploadProfileImage(formData).subscribe({
        next: (res) => {
          this.user.profileImageUrl = res.imageUrl; // adjust to your backend response
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Image upload failed', err);
        }
      });
    }
  }

}
