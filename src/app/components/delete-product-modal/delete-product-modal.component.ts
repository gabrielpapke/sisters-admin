import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
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
}
