import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadImagesService } from '../../download-images.service';
import {
  ESupplier,
  SuppliersService,
} from '../../../../services/suppliers.service';
import { DisableControlDirective } from '@shared/directives/disable-control.directive';
import { catchError, EMPTY, finalize } from 'rxjs';
import { DownloadActionsComponent } from '../download-actions/download-actions.component';

export interface IDownloadImage {
  name: string;
  url: string;
  supplier: ESupplier;
}

export interface IDownloadImageForm {
  name: FormControl<string | null>;
  url: FormControl<string | null>;
  supplier: FormControl<ESupplier | null>;
}

@Component({
  selector: 'app-download-item',
  imports: [
    CommonModule,
    DisableControlDirective,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    DownloadActionsComponent,
  ],
  templateUrl: './download-item.component.html',
  styleUrl: './download-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadItemComponent {
  private downloadImagesService = inject(DownloadImagesService);
  private suppliersService = inject(SuppliersService);
  private snackBar = inject(MatSnackBar);

  formItem = input.required<FormGroup<IDownloadImageForm>>();

  loading = signal(false);
  success = signal(false);
  error = signal(false);
  deleteItem = output<void>();

  suppliers$ = this.suppliersService.getAllSuppliers();

  download() {
    this.loading.set(true);
    this.error.set(false);
    this.success.set(false);
    const data: IDownloadImage = {
      supplier: this.formItem().value.supplier!,
      url: this.formItem().value.url!,
      name: this.formItem().value.name!,
    };

    this.downloadImagesService
      .export(data)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(() => {
          this.snackBar.open('Falha ao baixar imagem');
          this.error.set(true);
          return EMPTY;
        })
      )
      .subscribe((result) => {
        if (result.imageUrls && Array.isArray(result.imageUrls)) {
          result.imageUrls.forEach((imageUrl: string) => {
            this.downloadImage(imageUrl);
          });
          this.success.set(true);
        }
      });
  }

  downloadImage(imageUrl: string) {
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao baixar a imagem: ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = imageUrl.split('/').pop() || 'image'; // Define o nome do arquivo
        document.body.appendChild(link); // Adiciona o link ao DOM
        link.click(); // Simula o clique no link para iniciar o download
        document.body.removeChild(link); // Remove o link do DOM após o clique
        window.URL.revokeObjectURL(url); // Libera o objeto URL
      })
      .catch((error) => {
        console.error('Erro ao baixar a imagem:', error);
      });
  }
}
