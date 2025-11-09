import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const allowedRoles: string[] = route.data["roles"];
    if (allowedRoles && allowedRoles.length > 0) {
      if (authService.isInRole(allowedRoles)) {
        return true;
      } else {
        router.navigateByUrl('/not-authorized');
        return false;
      }
    }
    return true;
  }

  authService.loginRedirect();
  return false;
};
