import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Currency } from './currency';
import * as globals from '../../globals';
import { HttpClientService, HttpHandlerService } from '../../shared';

@Injectable()
export class CurrencyService {

  constructor(
    private http: HttpClientService,
    private httpHandlerService: HttpHandlerService
  ) {}

  /*
   * Returns currencies by page
   */
  getByPage(
    pageNum: number,
    respHandler: any = this.httpHandlerService.extractData
  ): Observable<any> {

    return this.http.get(globals.API_URL + 'currencies?page=' + pageNum)
                    .map(respHandler)
                    .catch(this.httpHandlerService.handleError);
  }

  /**
   * Creates a new currency
   * 
   * @param {Currency} currency - Currency data
   */
  create(currency: Currency): Observable<any> {

    let body = JSON.stringify(currency);
    return this.http.post(globals.API_URL + 'currencies', body)
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
  * Updates a currency
  * 
  * @param {Currency} currency - Currency data
  */
  update(currency: Currency): Observable<any> {

    let body = JSON.stringify(currency);
    return this.http.put(globals.API_URL + 'currencies/' + currency['id'], body)
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
   * Deletes a currency
   * 
   * @param {Currency} currency - Currency data
   */
  delete(currency: Currency): Observable<any> {

    return this.http.delete(globals.API_URL + 'currencies/' + currency['id'])
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
   * Returns all currencies
   */
  getAll(): Observable<any> {

    return this.http.get(globals.API_URL + 'currency/all')
                    .map(this.httpHandlerService.extractData)
                    .catch(this.httpHandlerService.handleError);
  }

}

