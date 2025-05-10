import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { PermissionDeniedRedirectService } from '@shared/services/permission-denied-redirect.service';
import { map } from 'rxjs';

export const rolePermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const permissionDeniedRedirect = inject(PermissionDeniedRedirectService);

  if (!route.data?.['rolePermission']) {
    return false;
  }

  return authService.getUserRole$().pipe(
    map((role) => {
      if (role === route.data['rolePermission']) {
        return true;
      } else {
        permissionDeniedRedirect.redirect(role);
        return false;
      }
    })
  );
};
