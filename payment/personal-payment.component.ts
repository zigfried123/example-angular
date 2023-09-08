import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as globals from '../../globals';
import { Payment } from './payment';
import { PaymentService } from './payment.service';
import { HttpHandlerService, StateManagerService } from '../../shared';

@Component({
  selector: 'app-personal-payment',
  templateUrl: './personal-payment.component.html',
  styleUrls: ['./personal-payment.component.css']
})
export class PersonalPaymentComponent implements OnInit {

  localGlobals: any = globals;

  personalPayments: Payment[];

  currentPage: number;
  totalRecords: number = 0;
  firstRowIndex: number = 0;

  constructor(
    private stateManagerService: StateManagerService,
    private httpHandlerService: HttpHandlerService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {

    // get page number from local storage
    this.currentPage = this.stateManagerService.getParamFromState(this.router.url, 'page');
    this.firstRowIndex = this.currentPage * this.localGlobals.ROWS_PER_PAGE - this.localGlobals.ROWS_PER_PAGE;

    // get total count 
    let respHandler = (res: any) => {
      this.totalRecords = res.headers.get('X-Pagination-Total-Count');
      return this.httpHandlerService.extractData(res);
    };

    this.paymentService.getPersonalByPage(this.currentPage, respHandler).subscribe(
      personalPayments => {
        this.personalPayments = personalPayments;
      },
      err => console.error(err)
    );

  }

  /**
   * On paginator click
   */
  paginate(event: any) {

    let newPageNum = event.page + 1;

    // save to page number to local storage
    this.stateManagerService.setParamForState(this.router.url, 'page', newPageNum);

    this.ngOnInit();

  }

}
