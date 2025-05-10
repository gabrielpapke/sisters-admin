import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-modal',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-product-modal.component.html',
  styleUrl: './delete-product-modal.component.scss',
})
export class DeleteProductModalComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteProductModalComponent>);
  data = inject<{ title: string; description: string }>(MAT_DIALOG_DATA);

  modalTitle = signal(this.data.title ?? 'Deseja executar essa ação?');
  modalDescription = signal(this.data.description ?? '');
}
