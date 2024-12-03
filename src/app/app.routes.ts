import { Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'configuracoes', component: ConfigComponent },
  { path: '**', component: HomeComponent },
];
