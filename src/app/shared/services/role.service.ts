import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private router: Router) {}

  redirectToRoleBasedRoute(role: string | null): void {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'seller') {
      this.router.navigate(['/seller']);
    } else {
      this.router.navigate(['/wait-permission']);
    }
  }
}
