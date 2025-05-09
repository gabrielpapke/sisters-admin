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
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteProductModalComponent } from '@dashboard/components/delete-product-modal/delete-product-modal.component';
import { HeaderComponent } from '@dashboard/components/header/header.component';
import { ESupplier } from '@dashboard/services/suppliers.service';
import { IVariationValuesItem } from '@dashboard/services/variations.service';
import { GeneralActionsComponent } from './components/general-actions/general-actions.component';
import {
  EProductType,
  IDuplicateProductEvent,
  ISkuForm,
  ProductComponent,
} from './components/product/product.component';

export type ISkuFormArray = FormArray<FormGroup<ISkuForm>>;

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
  variation_values: FormControl<IVariationValuesItem[] | null>;
  skus: ISkuFormArray;
  site_url: FormControl<string | null>;
}

@Component({
  selector: 'app-create-products',
  imports: [
    ProductComponent,
    CommonModule,
    GeneralActionsComponent,
    HeaderComponent,
    MatCardModule,
  ],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductsComponent {
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  readonly dialog = inject(MatDialog);

  mainForm = this.fb.group({
    products: this.fb.array<FormGroup<IProductForm>>([]),
  });

  get productsArray(): FormArray<FormGroup<IProductForm>> {
    return this.mainForm.get('products') as FormArray<FormGroup<IProductForm>>;
  }

  addVariationProduct() {
    this.addProduct({ type: EProductType.VARIATION });
  }

  addSimpleProduct() {
    this.addProduct({ type: EProductType.SIMPLE });
  }

  addProduct({
    type,
    form,
    incrementalDuplicate,
  }: {
    type: EProductType;
    form?: Partial<FormGroup<IProductForm>>;
    incrementalDuplicate?: number;
  }) {
    const isSimpleProduct = type === EProductType.SIMPLE;

    this.productsArray.push(
      this.fb.group<IProductForm>({
        id: new FormControl(null),
        type: new FormControl(type, { nonNullable: true }),
        name: new FormControl(
          form?.value?.name
            ? incrementalDuplicate
              ? `${form.value.name} (${incrementalDuplicate})`
              : form.value.name
            : null,
          {
            nonNullable: true,
            validators: Validators.required,
          }
        ),
        brand: new FormControl(form?.value?.brand ?? null, {
          nonNullable: true,
          validators: Validators.required,
        }),
        supplier: new FormControl(form?.value?.supplier ?? null, {
          nonNullable: true,
          validators: Validators.required,
        }),
        categories: new FormControl(form?.value?.categories ?? null),
        filters: new FormControl(form?.value?.filters ?? null),
        flags: new FormControl(form?.value?.flags ?? null),
        collections: new FormControl(form?.value?.collections ?? null),
        variations: new FormControl(form?.value?.variations ?? null, {
          nonNullable: true,
          validators: !isSimpleProduct ? Validators.required : null,
        }),
        variation_values: new FormControl(
          form?.value?.variation_values ?? null,
          {
            nonNullable: true,
            validators: !isSimpleProduct ? Validators.required : null,
          }
        ),
        skus: this.fb.array<FormGroup<ISkuForm>>(
          form?.controls?.skus.controls.length
            ? form?.controls?.skus.controls.map((control) =>
                this.createSkuForm(control.value as Partial<ISkuForm>)
              )
            : []
        ),
        site_url: new FormControl(form?.value?.site_url ?? null),
      })
    );

    this.cdr.markForCheck();
  }

  createSkuForm(sku: Partial<ISkuForm> = {}): FormGroup<ISkuForm> {
    return this.fb.group({
      id: new FormControl(0),
      variation_id: new FormControl(sku?.variation_id ?? null),
      name: new FormControl(sku?.name ?? null),
      sku: new FormControl(sku?.sku ?? '', { nonNullable: true }),
      price_cost: new FormControl(sku?.price_cost ?? 0, { nonNullable: true }),
      price_sale: new FormControl(sku?.price_sale ?? 0, { nonNullable: true }),
      price_discount: new FormControl(sku?.price_discount ?? 0, {
        nonNullable: true,
      }),
    });
  }

  onDeleteProduct(index: number) {
    this.productsArray.removeAt(index);
    this.cdr.markForCheck();
  }

  onDuplicateProduct({ form, incrementalDuplicate }: IDuplicateProductEvent) {
    const type = form.value?.type!;

    this.addProduct({ type, form, incrementalDuplicate });
  }

  removeAllProducts(event: Event) {
    event.preventDefault();

    const diologRef = this.openDialog();

    diologRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productsArray.clear();
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
