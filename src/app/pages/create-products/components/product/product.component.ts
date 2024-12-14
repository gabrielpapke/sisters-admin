import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { catchError, finalize, throwError } from 'rxjs';
import { DeleteProductModalComponent } from '../../../../components/delete-product-modal/delete-product-modal.component';
import { ExpansionPanelComponent } from '../../../../components/expansion-panel/expansion-panel.component';
import { IProductForm } from '../../../create-products/create-products.component';
import { PanelContentComponent } from './panel-content/panel-content.component';
import { PanelHeaderComponent } from './panel-header/panel-header.component';
import { ProductService } from './product.service';

export interface ISkuForm {
  id: FormControl<number | null>;
  variation_id: FormControl<number | null>;
  sku: FormControl<string>;
  name: FormControl<string | null>;
  price_cost: FormControl<number>;
  price_sale: FormControl<number>;
  price_discount: FormControl<number>;
}

export enum EProductType {
  SIMPLE = 'SIMPLE',
  VARIATION = 'VARIATION',
}

export interface IDuplicateProductEvent {
  form: Partial<FormGroup<IProductForm>>;
  incrementalDuplicate: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatAccordion,
    ExpansionPanelComponent,
    PanelHeaderComponent,
    PanelContentComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  readonly dialog = inject(MatDialog);
  readonly cdr = inject(ChangeDetectorRef);

  productService = inject(ProductService);

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }

  get created(): boolean {
    return !!this.productForm().controls.id.value;
  }

  productForm = input.required<FormGroup<IProductForm>>();

  opened = signal(false);
  loading = signal(false);
  hasError = signal(false);
  incrementalDuplicate = signal(0);

  deleteProduct = output<void>();
  duplicateProduct = output<IDuplicateProductEvent>();

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }

  toggle() {
    this.opened.update((status) => !status);
  }

  createProduct() {
    const {
      type,
      name,
      brand,
      supplier,
      categories,
      filters,
      flags,
      collections,
      variations,
      skus,
    } = this.productForm().value;

    this.setLoading(true);
    this.hasError.set(false);

    this.productService
      .create({
        id: null,
        type: type!,
        name: name!,
        brand: brand!,
        supplier: supplier!,
        categories: categories ?? [],
        filters: filters ?? [],
        collections: collections ?? [],
        flags: flags ?? [],
        variations: variations ? [variations] : [],
        skus: skus as Partial<ISkuForm>[],
      })
      .pipe(
        catchError((error) => {
          this.hasError.set(true);
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      )
      .subscribe((response) => {
        this.productForm().patchValue({
          id: response.data.id,
        });
      });
  }

  onSubmit() {
    if (this.productForm().invalid) return;

    this.createProduct();
  }

  onClickDuplicateProduct(event: Event) {
    event.preventDefault();

    this.incrementalDuplicate.update((val) => val + 1);

    this.duplicateProduct.emit({
      form: this.productForm(),
      incrementalDuplicate: this.incrementalDuplicate(),
    });
  }

  onClickDeleteProduct(event: Event) {
    event.preventDefault();

    const diologRef = this.openDialog();

    diologRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct.emit();
      }
    });
  }

  openDialog(): MatDialogRef<DeleteProductModalComponent> {
    return this.dialog.open(DeleteProductModalComponent, {
      data: {
        title: 'Remover produto',
        description: 'Deseja remover o produto?',
      },
    });
  }
}
