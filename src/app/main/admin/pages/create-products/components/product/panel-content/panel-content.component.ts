import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
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
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatExpansionPanelActionRow } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  IProductForm,
  ISkuFormArray,
} from '../../../create-products.component';
import { BrandsService } from '../../../../../services/brands.service';
import { CategoriesService } from '../../../../../services/categories.service';
import { CollectionsService } from '../../../../../services/collections.service';
import { FiltersService } from '../../../../../services/filters.service';
import { FlagsService } from '../../../../../services/flags.service';
import { SuppliersService } from '../../../../../services/suppliers.service';
import {
  IVariationsResponseItem,
  IVariationValuesItem,
  VariationsService,
} from '../../../../../services/variations.service';
import { DisableControlDirective } from '@shared/directives/disable-control.directive';
import { map, take, takeUntil, tap } from 'rxjs';
import { EProductType, ISkuForm } from '../product.component';

@Component({
  selector: 'app-panel-content',
  imports: [
    CommonModule,
    DisableControlDirective,
    MatExpansionPanelActionRow,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './panel-content.component.html',
  styleUrl: './panel-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelContentComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);

  categoriesService = inject(CategoriesService);
  filtersService = inject(FiltersService);
  collectionsService = inject(CollectionsService);
  flagsService = inject(FlagsService);
  brandsService = inject(BrandsService);
  suppliersService = inject(SuppliersService);
  variationsService = inject(VariationsService);

  categories$ = this.categoriesService.getAllCategories();
  filters$ = this.filtersService.getAllFilters();
  collections$ = this.collectionsService.getAllCollections();
  flags$ = this.flagsService.getAllFlags();
  brands$ = this.brandsService.getAllBrands();
  suppliers$ = this.suppliersService.getAllSuppliers();
  variations$ = this.variationsService.getAllVariations();

  productForm = input.required<FormGroup<IProductForm>>();
  isProductCreated = input.required<boolean>();
  loading = input.required<boolean>();

  selectedVariation = signal<IVariationsResponseItem | null>(null);

  onSubmit = output<void>();

  get isSimpleProduct() {
    return this.productForm().controls.type.value === EProductType.SIMPLE;
  }

  get skus(): ISkuFormArray {
    return this.productForm()?.get('skus') as ISkuFormArray;
  }

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

  onSelectVariation(
    event: MatOptionSelectionChange<number>,
    item: IVariationsResponseItem
  ) {
    if (!event.isUserInput) return;

    this.selectedVariation.set(item);
    this.productForm().controls.variation_values.reset();
    this.productForm().controls.skus.clear();
  }
}
