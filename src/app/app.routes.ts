import { Routes } from '@angular/router';
import { DownloadImagesComponent } from '@pages/download-images/download-images.component';
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
  {
    path: 'download-images',
    component: DownloadImagesComponent,
  },
  { path: '**', component: HomeComponent },
];
