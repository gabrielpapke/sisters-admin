import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ICategoriesResponse {
  data: ICategory[];
}

export interface ICategory {
  id: number;
  active: boolean;
  featured: boolean;
  parent_id: null;
  ml_category: null;
  name: string;
  slug: string;
  url: string;
  sort_by: string;
  price_factor: number;
  total_banners: number;
  external_url: string;
  canonical_url: string;
  seo: Seo;
  parent: Parent;
  children: any[];
}

interface Parent {}

interface Seo {
  data: Data;
}

interface Data {
  seo_title: string;
  seo_keywords: string;
  seo_description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  getAllCategories(): Observable<ICategoriesResponse> {
    return this.http.get<ICategoriesResponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/categories?limit=100'
    );
  }
}
