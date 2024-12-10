import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteProductModalComponent } from '../components/delete-product-modal/delete-product-modal.component';
import {
  EProductType,
  ISkuForm,
  ProductComponent,
} from '../product/product.component';
import { ESupplier } from '../services/suppliers.service';

export interface IProductForm {
  type: FormControl<EProductType>;
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  brand: FormControl<number | null>;
  supplier: FormControl<ESupplier | null>;
  categories: FormControl<number[] | null>;
  filters: FormControl<number[] | null>;
  flags: FormControl<number[] | null>;
  collections: FormControl<number[] | null>;
  variations: FormControl<number | null>;
  variation_values: FormControl<number[] | null>;
  skus: FormArray<FormControl<ISkuForm | null>>;
}

@Component({
  selector: 'app-create-products',
  imports: [ProductComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductsComponent {
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  readonly dialog = inject(MatDialog);

  products = this.fb.group({
    items: this.fb.array<FormGroup<IProductForm>>([]),
  });

  get itemsArray(): FormArray<FormGroup<IProductForm>> {
    return this.products.get('items') as FormArray<FormGroup<IProductForm>>;
  }

  addVariationProduct() {
    this.addProduct(EProductType.VARIATION);
  }

  addSimpleProduct() {
    this.addProduct(EProductType.SIMPLE);
  }

  addProduct(type: EProductType) {
    const isSimpleProduct = type === EProductType.SIMPLE;

    this.itemsArray.push(
      this.fb.group<IProductForm>({
        id: new FormControl(null),
        type: new FormControl(type, { nonNullable: true }),
        name: new FormControl(null, {
          nonNullable: true,
          validators: Validators.required,
        }),
        brand: new FormControl(null, {
          nonNullable: true,
          validators: Validators.required,
        }),
        supplier: new FormControl(null, {
          nonNullable: true,
          validators: Validators.required,
        }),
        categories: new FormControl(null),
        filters: new FormControl(null),
        flags: new FormControl(null),
        collections: new FormControl(null),
        variations: new FormControl(null, {
          nonNullable: true,
          validators: !isSimpleProduct ? Validators.required : null,
        }),
        variation_values: new FormControl(null, {
          nonNullable: true,
          validators: !isSimpleProduct ? Validators.required : null,
        }),
        skus: this.fb.array<ISkuForm>([]),
      })
    );
  }

  onDeleteProduct(index: number) {
    this.itemsArray.removeAt(index);
  }

  removeAllProducts(event: Event) {
    event.preventDefault();

    const diologRef = this.openDialog();

    diologRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemsArray.clear();
        this.cdr.markForCheck();
      }
    });
  }

  openDialog(): MatDialogRef<DeleteProductModalComponent> {
    return this.dialog.open(DeleteProductModalComponent, {
      data: {
        title: 'Remover produtos',
        description: 'Deseja remover TODOS os produtos?',
      },
    });
  }
}
