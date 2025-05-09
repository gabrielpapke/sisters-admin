import { Routes } from '@angular/router';
import { ConfigComponent } from '@dashboard/pages/config/config.component';
import { CreateProductsComponent } from '@dashboard/pages/create-products/create-products.component';
import { DownloadImagesComponent } from '@dashboard/pages/download-images/download-images.component';
import { HomeComponent } from '@dashboard/pages/home/home.component';
import { hasTokenGuard } from '@shared/guards/has-token.guard';

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
