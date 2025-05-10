import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RootObject {
  data: Datum[];
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
  links: Links;
}

interface Links {
  next: string;
}

interface Datum {
  id: number;
  name: string;
  color: null;
  image_url: null;
  created_at: Createdat;
  updated_at: Createdat;
  filter: Filter;
}

interface Filter {
  data: Data;
}

interface Data {
  id: number;
  searchable: boolean;
  navigation: boolean;
  name: string;
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
export class FiltersService {
  private http = inject(HttpClient);

  getAllFilters(): Observable<RootObject> {
    return this.http.get<RootObject>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/filters/all-values?grouped=true&page=1&limit=100&include=filter&q=&requestID=3'
    );
  }
}
