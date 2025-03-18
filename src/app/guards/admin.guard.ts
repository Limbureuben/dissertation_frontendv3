import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // ✅ Inject Router correctly
  const token = localStorage.getItem('success_token');
  const isStaff = localStorage.getItem('is_staff') === 'true';

  console.log('Admin Guard Check:');
  console.log('Token:', token ? '✅ Exists' : '❌ Missing');
  console.log('Is Staff:', isStaff);

  if (token && isStaff) {
    return true; // ✅ Allow access if staff is authenticated
  }


  router.navigate(['/']);
  return false;
};

