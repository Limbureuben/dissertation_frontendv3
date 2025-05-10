import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoTokenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, redirect to homepage
      this.router.navigate(['/homepage']);
      return false;
    }
    return true; // Allow access only if token does NOT exist
  }
}
