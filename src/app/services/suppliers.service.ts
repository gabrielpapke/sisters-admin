import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export enum ESupplier {
  EL = 'EL',
  GF = 'GF',
  AT = 'AT',
  LB = 'LB',
}

@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  constructor() {}

  getAllSuppliers(): Observable<ESupplier[]> {
    return of(Object.values(ESupplier));
  }

  getMeasureBySupply(supplier: ESupplier): string {
    const measures: Record<ESupplier, string> = {
      [ESupplier.EL]:
        '<p><img src="https://s3.sa-east-1.amazonaws.com/king-assets.yampi.me/dooki/65e7bdbc03726/65e7bdbc0372d.png" alt="Tabela de Medidas" /></p>',
      [ESupplier.AT]:
        '<p><img src="https://s3.sa-east-1.amazonaws.com/king-assets.yampi.me/dooki/6629c9c71c057/6629c9c71c05b.png" alt="Tabela de Medidas" /></p>',
      [ESupplier.LB]: '',
      [ESupplier.GF]:
        '<p><img src="https://king-assets.yampi.me/dooki/66dcbabe30234/66dcbabe30235.png" alt="Tabela de Medidas"></p>',
    };

    return measures[supplier];
  }
}
