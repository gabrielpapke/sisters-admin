import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
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
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {
  catchError,
  finalize,
  map,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DeleteProductModalComponent } from '../components/delete-product-modal/delete-product-modal.component';
import {
  IProductForm,
  ISkuFormArray,
} from '../create-products/create-products.component';
import { BrandsService } from '../services/brands.service';
import { CategoriesService } from '../services/categories.service';
import { CollectionsService } from '../services/collections.service';
import { FiltersService } from '../services/filters.service';
import { FlagsService } from '../services/flags.service';
import { SuppliersService } from '../services/suppliers.service';
import {
  IVariationsResponseItem,
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
    MatMenuModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit {
  productService = inject(ProductService);
  categoriesService = inject(CategoriesService);
  filtersService = inject(FiltersService);
  collectionsService = inject(CollectionsService);
  flagsService = inject(FlagsService);
  brandsService = inject(BrandsService);
  suppliersService = inject(SuppliersService);
  variationsService = inject(VariationsService);
  fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  readonly cdr = inject(ChangeDetectorRef);

  categories$ = this.categoriesService.getAllCategories();
  filters$ = this.filtersService.getAllFilters();
  collections$ = this.collectionsService.getAllCollections();
  flags$ = this.flagsService.getAllFlags();
  brands$ = this.brandsService.getAllBrands();
  suppliers$ = this.suppliersService.getAllSuppliers();
  variations$ = this.variationsService.getAllVariations();

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }

  get skus(): ISkuFormArray {
    return this.productForm()?.get('skus') as ISkuFormArray;
  }

  get created(): boolean {
    return !!this.productForm().controls.id.value;
  }

  productForm = input.required<FormGroup<IProductForm>>();
  selectedVariation = signal<IVariationsResponseItem | null>(null);
  deleteProduct = output<void>();
  duplicateProduct = output<IDuplicateProductEvent>();
  opened = signal(false);
  loading = signal(false);
  hasError = signal(false);
  incrementalDuplicate = signal(0);

  private _destroy$ = new EventEmitter<void>();

  ngOnInit() {
    if (this.isSimpleProduct && this.skus.length === 0) {
      this.skus.push(this.createSku());
    }

    if (!this.isSimpleProduct && this.skus.length) {
      this.variations$
        .pipe(
          take(1),
          takeUntil(this._destroy$),
          map(
            (item) =>
              item.data.find(
                (variation) =>
                  variation.id === this.productForm().controls.variations.value
              ) ?? null
          ),
          tap((item: IVariationsResponseItem | null) => {
            this.selectedVariation.set(item);
            const skusVariationsIds = this.skus.value.map(
              (item) => item.variation_id
            );

            const filteredValues =
              item?.values.data.filter((value) =>
                skusVariationsIds.includes(value.id)
              ) ?? [];

            this.productForm().patchValue({
              variation_values: filteredValues,
            });
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSelectVariation(
    event: MatOptionSelectionChange<number>,
    item: IVariationsResponseItem
  ) {
    if (!event.isUserInput) return;

    this.selectedVariation.set(item);
    this.productForm().controls.variation_values.reset();
    this.productForm().controls.skus.clear();
  }

  onSelectVariationValue(
    event: MatOptionSelectionChange<IVariationValuesItem>
  ) {
    if (!event.isUserInput) return;

    const { value, selected } = event.source;

    if (selected) {
      const newSku = this.createSku({
        variation_id: value.id,
        name: value.name,
      });
      this.skus.push(newSku);
    } else {
      const index = this.skus.value.findIndex((item: any) => {
        return item?.variation_id === value.id;
      });

      if (index > -1) this.productForm().controls.skus.removeAt(index);
    }
  }

  createSku({
    variation_id = null,
    name = null,
  }: {
    variation_id?: number | null;
    name?: string | null;
  } = {}): FormGroup<ISkuForm> {
    return this.fb.group({
      id: new FormControl<number | null>(null),
      variation_id: new FormControl<number | null>(variation_id),
      name: new FormControl<string | null>(name),
      sku: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      price_cost: new FormControl<number>(0, { nonNullable: true }),
      price_sale: new FormControl<number>(0, { nonNullable: true }),
      price_discount: new FormControl<number>(0, { nonNullable: true }),
    });
  }

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
