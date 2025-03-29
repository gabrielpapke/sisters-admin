import { Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IDownloadImageForm } from '../download-item/download-item.component';

@Component({
  selector: 'app-download-actions',
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './download-actions.component.html',
  styleUrl: './download-actions.component.scss',
})
export class DownloadActionsComponent {
  formItem = input.required<FormGroup<IDownloadImageForm>>();
  deleteItem = output<void>();
  loading = input.required();
  success = input.required();
  error = input.required();
}
