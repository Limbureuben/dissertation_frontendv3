import { CanActivateFn } from '@angular/router';

export const noTokenGuard: CanActivateFn = (route, state) => {
  return true;
};
