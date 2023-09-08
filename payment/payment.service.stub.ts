import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';

import { Payment } from './payment';

@Injectable()
export class PaymentServiceStub {

    project: ReplaySubject<any> = new ReplaySubject(1);

    payments: Payment[] = [
        {
            id: 1,
            service_user_id: 1,
            type_id: 1,
            created_by: 1,
            created_at: 1,
            comment: 'comment1'
        },
        {
            id: 2,
            service_user_id: 2,
            type_id: 2,
            created_by: 2,
            created_at: 2,
            comment: 'comment2'
        }
    ];

  /*
   * Returns payments by page
   */
  getByPage(
    pageNum: number,
    respHandler: any
  ) {
      this.project.next(this.payments);
      return this.project;
  }

  /*
   * Returns personal payments by page
   */
  getPersonalByPage(
    pageNum: number,
    respHandler: any
  ) {
      this.project.next([this.payments[0]]);
      return this.project;
  }

  /**
   * Creates a new payment
   * 
   * @param {Payment} payment - Payment data
   */
  create(payment: Payment) {
      this.project.next(payment);
      return this.project;
  }

  /**
  * Updates a payment
  * 
  * @param {Payment} payment - Payment data
  */
  update(payment: Payment) {
      this.project.next(payment);
      return this.project;
  }

  /**
   * Deletes a payment
   * 
   * @param {Payment} payment - Payment data
   */
  delete(payment: Payment) {
      this.project.next({});
      return this.project;
  }

  /**
   * Get all payments
   */
  getAll(respHandler: any) {
    this.project.next(this.payments);
    return this.project;
  }

  /**
   * Makes a purchase
   */
  purchase(card, cvv, expMonth, expYear, externalId, holder) {
    this.project.next({});
    return this.project;
  }

}
