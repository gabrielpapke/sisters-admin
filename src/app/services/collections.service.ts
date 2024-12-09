import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ICollectionsResponse {
  data: ICollectionsResponseItem[];
  meta: Meta;
}

interface Meta {
  pagination: Pagination;
}

interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: any[];
}

interface ICollectionsResponseItem {
  id: number;
  active: boolean;
  featured: boolean;
  parent_id: null;
  show_banners: boolean;
  is_promotional: boolean;
  home: boolean;
  expired: boolean;
  expire_in: string;
  name: string;
  slug: string;
  visible_products: number;
  description: null | string;
  total_products: number;
  seo_title: null | string;
  seo_description: null | string;
  seo_keywords: null;
  start_at: Startat;
  end_at: Startat;
  path: string;
  stopwatch: null;
  stopwatch_expires_in: null;
  url: string;
  restricted: null;
  created_at: Startat;
  updated_at: Startat;
}

interface Startat {
  date: string;
  timezone_type: number;
  timezone: string;
}

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private http = inject(HttpClient);

  getAllCollections(): Observable<ICollectionsResponse> {
    return this.http.get<ICollectionsResponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/collections?limit=100'
    );
  }
}
