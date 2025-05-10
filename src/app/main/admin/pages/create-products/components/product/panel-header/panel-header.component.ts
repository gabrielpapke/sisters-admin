import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
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
  private readonly cdr = inject(ChangeDetectorRef);

  productForm = input.required<FormGroup<IProductForm>>();
  isProductCreated = input.required<boolean>();
  hasError = input.required<boolean>();
  loading = input.required<boolean>();

  onDuplicateProduct = output<Event>();
  onRemoveProduct = output<Event>();

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }

  private _destroy$ = new EventEmitter<void>();

  ngOnInit() {
    this.productForm().controls.name.valueChanges.subscribe(() => {
      console.log('changed!');
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
