import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatOptionSelectionChange,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { DeleteProductModalComponent } from '../components/delete-product-modal/delete-product-modal.component';
import { IProductForm } from '../create-products/create-products.component';
import { BrandsService } from '../services/brands.service';
import { CategoriesService } from '../services/categories.service';
import { FiltersService } from '../services/filters.service';
import {
  IVariationValuesItem,
  VariationsService,
} from '../services/variations.service';
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

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit {
  productService = inject(ProductService);
  categoriesService = inject(CategoriesService);
  filtersService = inject(FiltersService);
  brandsService = inject(BrandsService);
  variationsService = inject(VariationsService);
  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);

  categories$ = this.categoriesService.getAllCategories();
  filters$ = this.filtersService.getAllFilters();
  brands$ = this.brandsService.getAllBrands();
  variations$ = this.variationsService.getAllVariations();

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }

  get skus() {
    return this.productForm()?.get('skus') as FormArray;
  }

  get created() {
    return this.productForm().controls.id.value;
  }

  productForm = input.required<FormGroup<IProductForm>>();
  deleteProduct = output<void>();
  opened = signal(false);
  loading = signal(false);

  ngOnInit() {
    if (this.isSimpleProduct) {
      this.skus.push(this.createSku());
    }

    this.productForm().controls.variations.valueChanges.subscribe((v) => {
      this.productForm().controls.variation_values.reset();

      if (!v) {
        this.productForm().controls.variation_values.addValidators(
          Validators.required
        );
      } else {
        this.productForm().controls.variation_values.removeValidators(
          Validators.required
        );
      }

      this.productForm().controls.variation_values.updateValueAndValidity();
    });
  }

  onSelectVariation(event: MatOptionSelectionChange<IVariationValuesItem>) {
    const { value, selected } = event.source;

    if (selected) {
      this.skus.push(
        this.createSku({ variation_id: value.id, name: value.name })
      );
    } else {
      const index = this.skus.value.findIndex(
        (item: { variation_id: number }) => item?.variation_id === value.id
      );

      if (index > -1) this.productForm().controls.skus.removeAt(index);
    }
  }

  createSku({
    variation_id = null,
    name = null,
  }: { variation_id?: number | null; name?: string | null } = {}) {
    return this.fb.group<ISkuForm>({
      id: new FormControl(null),
      variation_id: new FormControl(variation_id),
      name: new FormControl(name),
      sku: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      price_cost: new FormControl(0, { nonNullable: true }),
      price_sale: new FormControl(0, { nonNullable: true }),
      price_discount: new FormControl(0, { nonNullable: true }),
    });
  }

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }

  toggle() {
    this.opened.update((status) => !status);
  }

  createProduct() {
    const { type, name, brand, categories, filters, variations, skus } =
      this.productForm().value;

    this.setLoading(true);

    this.productService
      .create({
        id: null,
        type: type!,
        name: name!,
        brand: brand!,
        categories: categories ?? [],
        filters: filters ?? [],
        variations: variations ? [variations.id] : [],
        skus: skus as ISkuForm[],
      })
      .pipe(finalize(() => this.setLoading(false)))
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

  onClickDeleteProduct() {
    const diologRef = this.openDialog();

    diologRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProduct.emit();
      }
    });
  }

  openDialog(): MatDialogRef<DeleteProductModalComponent> {
    return this.dialog.open(DeleteProductModalComponent, {
      width: '250px',
    });
  }
}
