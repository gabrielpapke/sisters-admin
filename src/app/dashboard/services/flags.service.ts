import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IFlagsResponse {
  data: IFlagsResponseItem[];
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

interface IFlagsResponseItem {
  id: number;
  active: boolean;
  is_visible: boolean;
  name: string;
  slug: string;
  total_products: number;
  text_color: string;
  background_color: string;
  image_url: null;
  created_at: Createdat;
  updated_at: Createdat;
}

interface Createdat {
  date: string;
  timezone_type: number;
  timezone: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlagsService {
  private http = inject(HttpClient);

  getAllFlags(): Observable<IFlagsResponse> {
    return this.http.get<IFlagsResponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/flags?limit=100'
    );
  }
}
