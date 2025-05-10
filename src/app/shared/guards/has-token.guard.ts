import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../main/admin/services/token.service';

export const hasTokenGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.hasToken()) {
    return true;
  }

  router.navigate(['/admin/configuracoes']);
  return false;
};
