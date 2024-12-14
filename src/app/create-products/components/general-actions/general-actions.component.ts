import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general-actions',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './general-actions.component.html',
  styleUrl: './general-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralActionsComponent {
  hasProducts = input.required<boolean>();

  onAddSimpleProduct = output<void>();
  onAddVariationProduct = output<void>();
  onRemoveAllProducts = output<Event>();
}
