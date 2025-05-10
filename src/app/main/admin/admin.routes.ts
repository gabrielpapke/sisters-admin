import { Routes } from '@angular/router';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { hasTokenGuard } from '@shared/guards/has-token.guard';
import { ConfigComponent } from './pages/config/config.component';
import { CreateProductsComponent } from './pages/create-products/create-products.component';
import { DownloadImagesComponent } from './pages/download-images/download-images.component';
import { HomeComponent } from './pages/home/home.component';

export const adminRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'configuracoes', component: ConfigComponent },
  {
    path: 'cadastrar-produtos',
    component: CreateProductsComponent,
    canActivate: [hasTokenGuard],
  },
  {
    path: 'download-images',
    component: DownloadImagesComponent,
  },
  { path: '**', component: NotFoundComponent },
];
