import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { RoleService } from '@shared/services/role.service';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const roleService = inject(RoleService);

  return authService.getUserRole$().pipe(
    map((role) => {
      console.log('RoleGuard - Role:', role);

      if (state.url === '/') {
        roleService.redirectToRoleBasedRoute(role);
        return false;
      }

      return true;
    })
  );
};
