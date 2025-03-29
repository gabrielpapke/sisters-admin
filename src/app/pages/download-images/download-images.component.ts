import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '@components/header/header.component';
import {
  DownloadItemComponent,
  IDownloadImageForm,
} from './components/download-item/download-item.component';

@Component({
  selector: 'app-download-images',
  imports: [
    HeaderComponent,
    DownloadItemComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './download-images.component.html',
  styleUrl: './download-images.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadImagesComponent {
  fb = inject(FormBuilder);

  mainForm = this.fb.group({
    items: this.fb.array<FormGroup<IDownloadImageForm>>([]),
  });

  get items() {
    return this.mainForm.controls.items;
  }

  addFormItem() {
    const newItem = new FormGroup<IDownloadImageForm>({
      name: new FormControl(null, {
        nonNullable: true,
        validators: Validators.required,
      }),
      url: new FormControl(null, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
          ),
        ],
      }),
      supplier: new FormControl(null, {
        nonNullable: true,
        validators: Validators.required,
      }),
    });

    this.items.push(newItem);
  }

  onDeleteItem(index: number) {
    this.items.removeAt(index);
  }

  clearAllItems() {
    this.items.clear();
  }
}
