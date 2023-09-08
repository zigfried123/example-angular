import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';

import { Currency } from './currency';
import { BaseServiceStub } from '../../shared';

@Injectable()
export class CurrencyServiceStub extends BaseServiceStub {

    currencies: Currency[] = [
        {
            id: 1,
            short_name: 'RUB',
            full_name: 'Rubles',
            is_active: 1
        },
        {
            id: 2,
            short_name: 'EUR',
            full_name: 'Euros',
            is_active: 0
        },
    ];

  /*
   * Returns currencies by page
   */
  getByPage(
    pageNum: number,
    respHandler: any
  ): Observable<any> {
    this.next(this.currencies);
    return this.project;
  }

  /**
   * Creates a new currency
   * 
   * @param {Currency} currency - Currency data
   */
  create(currency: Currency): Observable<any> {
    this.next(currency);
    return this.project;
  }

  /**
  * Updates a currency
  * 
  * @param {Currency} currency - Currency data
  */
  update(currency: Currency): Observable<any> {
    this.next(currency);
    return this.project;
  }

  /**
   * Deletes a currency
   * 
   * @param {Currency} currency - Currency data
   */
  delete(currency: Currency): Observable<any> {
    this.next({});
    return this.project;
  }

  /**
   * Returns all currencies
   */
  getAll(): Observable<any> {
    this.next(this.currencies);
    return this.project;
  }

}
