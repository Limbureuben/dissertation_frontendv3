import { CanActivateFn } from '@angular/router';

let actionTaken = false;

export const adminExistGuard: CanActivateFn = (route, state) => {
  const isAdminLoggingIn = state.url === '/admindashboard';

  if (isAdminLoggingIn || actionTaken) {
    return true; // Allow navigation on login OR after clicking a button
  }

  console.warn("Navigation blocked: Admin must take an action before leaving.");
  return false; // Block manual navigation
};

export function allowNavigation() {
  actionTaken = true;
}
