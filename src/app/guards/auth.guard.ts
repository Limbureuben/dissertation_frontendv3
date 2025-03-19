import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('success_token');


    if (token) {
      return true;
    }

    if (state.url === '/map-display') {
      return true;
    }

    router.navigate(['/']);
    return false;
  }

  return false;
};


