import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ESupplier, SuppliersService } from '../services/suppliers.service';
import { EProductType, ISkuForm } from './product.component';

export interface IProductRequest {
  id: number | null;
  type: EProductType;
  name: string;
  brand: number;
  supplier: ESupplier;
  categories: number[];
  filters: number[];
  variations: number[];
  skus: ISkuForm[];
}

interface IProductResponse {
  data: IProductResponseItem;
}

interface IProductResponseItem {
  relevance: null;
  id: number;
  merchant_id: number;
  seller_id: null;
  affiliation_id: null;
  active: boolean;
  gift_value: string;
  searchable: boolean;
  simple: boolean;
  erp_id: null;
  ncm: null;
  has_variations: boolean;
  is_digital: boolean;
  warranty: null;
  custom_shipping: boolean;
  shipping_price: string;
  name: string;
  slug: string;
  sku: string;
  rating: number;
  priority: number;
  url: string;
  redirect_url_card: null;
  redirect_url_billet: null;
  preview_url: string;
  skus: ISkuResponse;
}

interface ISkuResponse {
  data: ISkuResponseItem[];
}

interface ISkuResponseItem {
  id: number;
  product_id: number;
  seller_id: null;
  sku: string;
  token: string;
  erp_id: null;
  blocked_sale: boolean;
  barcode: null;
  title: string;
  availability: number;
  availability_soldout: number;
  days_availability_formated: string;
  price_cost: number;
  price_sale: number;
  price_discount: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity_managed: boolean;
  variations: Variation[];
  combinations: string;
  order: number;
  total_in_stock: number;
  total_orders: null;
  allow_sell_without_customization: boolean;
  image_reference_sku_id: null;
  purchase_url: string;
  created_at: Createdat;
  updated_at: Createdat;
  customizations: Customizations;
}

interface Customizations {
  data: any[];
}

interface Createdat {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface Variation {
  name: string;
  id: number;
  value: string;
  value_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private suppliersService = inject(SuppliersService);

  create({
    name,
    brand,
    supplier,
    filters,
    categories,
    type,
    variations,
    skus,
  }: IProductRequest) {
    return this.http.post<IProductResponse>(
      'https://api.dooki.com.br/v2/sisters-fitness/catalog/products?include=skus',
      {
        simple: type === EProductType.SIMPLE,
        brand_id: brand,
        erp_id: null,
        active: false,
        searchable: true,
        is_digital: false,
        buy_similars: false,
        priority: 1,
        rating: 5,
        ncm: null,
        name,
        slug: null,
        video: '',
        description: null,
        specifications: null,
        measures: this.suppliersService.getMeasureBySupply(supplier),
        gift_value: 0,
        seo_title: name,
        seo_description: null,
        seo_keywords: null,
        canonical_url: null,
        search_terms: null,
        categories_ids: categories,
        flags_ids: [],
        filters_values_ids: filters,
        use_different_images: false,
        variations_ids: variations,
        skus: skus.map((item) => ({
          sku: item.sku,
          erp_id: '',
          barcode: '',
          price_cost: item.price_cost,
          price_sale: item.price_sale,
          price_discount: item.price_discount,
          weight: 0.4,
          height: 8,
          width: 21,
          length: 28,
          quantity_managed: true,
          stock_quantity: 0,
          stock_min_quantity: 0,
          availability: 1,
          availability_soldout: -1,
          blocked_sale: false,
          variations_values_ids: item.variation_id ? [item.variation_id] : null,
          images: [
            {
              url: 'https://images.yampi.me/assets/stores/sisters-fitness/uploads/images/camisao-estampado-abacaxi-66de1e3b26a5c-large.jpg',
            },
          ],
        })),
      }
    );
  }
}
