import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IBrandsResponse {
  data: IBrandResponseItem[];
}

interface IBrandResponseItem {
  id: number;
  active: boolean;
  featured: boolean;
  name: string;
  description: string;
  logo_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private http = inject(HttpClient);

  getAllBrands(): Observable<IBrandsResponse> {
    return this.http.get<IBrandsResponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/brands?limit=100'
    );
  }
}
