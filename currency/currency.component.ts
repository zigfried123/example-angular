import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Currency } from './currency';
import { CurrencyService } from './currency.service';
import * as globals from '../../globals';
import { DataTransformService, HttpHandlerService, StateManagerService } from '../../shared';

@Component({
  selector: 'app-currency',
  templateUrl: 'currency.component.html',
  styleUrls: ['currency.component.css']
})
export class CurrencyComponent implements OnInit {

  localGlobals: any = globals;

  currencies: Currency[];
  selectedCurrency: Currency;
  currency: any = new Currency();
  isNewCurrency: boolean;
  displayDialog: boolean;

  statuses: any = [
    {label: 'Активен', value: 1},
    {label: 'Не активен', value: 0}
  ];

  currentPage: number;
  totalRecords: number = 0;
  firstRowIndex: number = 0;

  constructor(
    public stateManagerService: StateManagerService,
    public httpHandlerService: HttpHandlerService,
    public currencyService: CurrencyService,
    public dataTransformService: DataTransformService,
    public router: Router
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

    this.currencyService.getByPage(this.currentPage, respHandler).subscribe(
      currencies => {
        this.currencies = currencies;
      },
      error => console.error(error)
    );

  }

  /**
  * On row click
  */
  onRowSelect(event) {
    this.isNewCurrency = false;
    this.currency = this.dataTransformService.cloneObject(event.data);
    this.displayDialog = true;
  }

  /**
   * On "add currency" click
   */
  showDialogToAdd() {
    this.isNewCurrency = true;
    this.currency = new Currency();
    this.currency['is_active'] = 0;
    this.displayDialog = true;
  }

  /**
   * Saves currency
   */
  save() {

    if (this.isNewCurrency) {
      // send data to server
      this.currencyService.create(this.currency)
      .subscribe(
        currency => { this.ngOnInit(); },
        error => console.log(error)
      );
    } else {
      // send data to server
      this.currencyService.update(this.currency)
        .subscribe(
          resp => { this.ngOnInit(); },
          error => console.log(error)
        );
    }
    this.currency = null;
    this.displayDialog = false;
  }

  /**
   * Deletes a currency
   */
  delete() {
    this.currencyService.delete(this.currency)
      .subscribe(
        resp => { this.ngOnInit(); },
        error => console.log(error)
      );
    this.currency = null;
    this.displayDialog = false;
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
