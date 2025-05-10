import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IDownloadImage } from './components/download-item/download-item.component';

@Injectable({
  providedIn: 'root',
})
export class DownloadImagesService {
  private http = inject(HttpClient);

  export({ name, url, supplier }: IDownloadImage) {
    return this.http.post<{ message: string; imageUrls: string[] }>(
      `${environment.apiUrl}/export-images`,
      {
        name,
        url,
        supplier,
      }
    );
  }
}
