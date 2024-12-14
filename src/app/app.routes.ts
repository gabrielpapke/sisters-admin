import { Routes } from '@angular/router';
import { hasTokenGuard } from './guards/has-token.guard';
import { ConfigComponent } from './pages/config/config.component';
import { CreateProductsComponent } from './pages/create-products/create-products.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'configuracoes', component: ConfigComponent },
  {
    path: 'cadastrar-produtos',
    component: CreateProductsComponent,
    canActivate: [hasTokenGuard],
  },
  { path: '**', component: HomeComponent },
];
