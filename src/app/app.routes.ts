import { Routes } from '@angular/router';
import { DashboardComponent } from '@seller/pages/dashboard/dashboard.component';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { PermissionDeniedComponent } from '@shared/components/permission-denied/permission-denied.component';
import { authGuard } from '@shared/guards/auth.guard';
import { redirectIfAuthenticatedGuard } from '@shared/guards/redirect-if-authenticated.guard';
import { rolePermissionGuard } from '@shared/guards/role-permission.guard';
import { roleGuard } from '@shared/guards/role.guard';
import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './main/admin/admin.component';
import { adminRoutes } from './main/admin/admin.routes';
import { MainComponent } from './main/main.component';
import { SellerComponent } from './main/seller/seller.component';
import { WaitPermissionComponent } from './wait-permission/wait-permission.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [redirectIfAuthenticatedGuard],
    component: AuthComponent,
  },
  {
    path: 'wait-permission',
    component: WaitPermissionComponent,
  },
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    component: MainComponent,
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [rolePermissionGuard],
        data: {
          rolePermission: 'admin',
        },
        children: [...adminRoutes],
      },
      {
        path: 'seller',
        component: SellerComponent,
        canActivate: [rolePermissionGuard],
        data: {
          rolePermission: 'seller',
        },
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
          {
            path: 'permission-denied',
            component: PermissionDeniedComponent,
          },
          { path: '**', component: NotFoundComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/auth' },
];
