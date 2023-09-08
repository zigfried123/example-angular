import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

import * as globals from '../../globals';
import { Payment } from './payment';
import { HttpHandlerService, HttpClientService } from '../../shared';

@Injectable()
export class PaymentService {

  TYPE_MANUAL = 1;
  TYPE_PAYMASTER = 2;
  TYPE_ECOMMPAY = 3;

  typesForDD = [
    { label: 'Ручной ввод', value: this.TYPE_MANUAL },
    { label: 'Paymaster', value: this.TYPE_PAYMASTER },
    { label: 'Ecommpay', value: this.TYPE_ECOMMPAY }
  ];

  constructor(
    private http: HttpClientService,
    private httpHandlerService: HttpHandlerService
  ) {}

  /*
   * Returns payments by page
   */
  getByPage(
    pageNum: number,
    respHandler: any = this.httpHandlerService.extractData
  ): Observable<any> {

    return this.http.get(globals.API_URL + 'payments?page=' + pageNum + '&expand=type,createdBy')
                    .map(respHandler)
                    .catch(this.httpHandlerService.handleError);
  }

  /*
   * Returns personal payments by page
   */
  getPersonalByPage(
    pageNum: number,
    respHandler: any = this.httpHandlerService.extractData
  ): Observable<any> {

    return this.http.get(globals.API_URL + 'payment/index-personal?page=' + pageNum)
                    .map(respHandler)
                    .catch(this.httpHandlerService.handleError);
  }

  /**
   * Creates a new payment
   * 
   * @param {Payment} payment - Payment data
   */
  create(payment: Payment): Observable<any> {

    let body = JSON.stringify(payment);
    return this.http.post(globals.API_URL + 'payments', body)
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
  * Updates a payment
  * 
  * @param {Payment} payment - Payment data
  */
  update(payment: Payment): Observable<any> {

    let body = JSON.stringify(payment);
    return this.http.put(globals.API_URL + 'payments/' + payment['id'], body)
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
   * Deletes a payment
   * 
   * @param {Payment} payment - Payment data
   */
  delete(payment: Payment): Observable<any> {

    return this.http.delete(globals.API_URL + 'payments/' + payment['id'])
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);

  }

  /**
   * Get all payments
   */
  getAll(respHandler: any = this.httpHandlerService.extractData): Observable<any> {

    return this.http.get(globals.API_URL + 'payment/search?expand=type,createdBy&all=true')
      .map(respHandler)
      .catch(this.httpHandlerService.handleError);

  }

  /**
   * Makes a purchase
   */
  purchase(card, cvv, expMonth, expYear, externalId, holder): Observable<any> {

    let body = JSON.stringify({
      card: card,
      cvv: cvv,
      exp_month: expMonth,
      exp_year: expYear,
      external_id: externalId,
      holder: holder
    });

    return this.http.post(globals.API_URL + 'payment/purchase', body)
      .map(this.httpHandlerService.extractData)
      .catch(this.httpHandlerService.handleError);
  }

  checkFileAfterNotification(externalId) {
      let body = JSON.stringify({
          payment_id: externalId,
      });

      return this.http.post(globals.API_URL + 'payment/check-file-after-notification', body)
          .map(this.httpHandlerService.extractData)
          .catch(this.httpHandlerService.handleError);
  }

}
