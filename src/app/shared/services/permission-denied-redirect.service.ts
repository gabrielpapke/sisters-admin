import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionDeniedRedirectService {
  constructor(private router: Router) {}

  redirect(role: string | null): void {
    if (role === 'admin') {
      this.router.navigate(['/admin/permission-denied']);
    } else if (role === 'seller') {
      this.router.navigate(['/seller/permission-denied']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
