import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IProductForm } from '../../../create-products.component';
import { EProductType } from '../product.component';

@Component({
  selector: 'app-panel-header',
  imports: [MatExpansionModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './panel-header.component.html',
  styleUrl: './panel-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelHeaderComponent {
  productForm = input.required<FormGroup<IProductForm>>();
  isProductCreated = input.required<boolean>();
  hasError = input.required<boolean>();
  loading = input.required<boolean>();

  onDuplicateProduct = output<Event>();
  onRemoveProduct = output<Event>();

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }
}
