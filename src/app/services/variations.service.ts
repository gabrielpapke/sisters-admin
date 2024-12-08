import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IVariationsReponse {
  data: IVariationsResponseItem[];
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

export interface IVariationsResponseItem {
  id: number;
  name: string;
  created_at: Createdat;
  updated_at: Createdat;
  values: IVariationValues;
}

interface IVariationValues {
  data: IVariationValuesItem[];
}

export interface IVariationValuesItem {
  id: number;
  name: string;
  identification: string;
  color: null;
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
export class VariationsService {
  private http = inject(HttpClient);

  getAllVariations(): Observable<IVariationsReponse> {
    return this.http.get<IVariationsReponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/variations?limit=100&include=values'
    );
  }
}
