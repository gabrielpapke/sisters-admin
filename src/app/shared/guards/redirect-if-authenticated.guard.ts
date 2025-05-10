import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { map } from 'rxjs';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
};
