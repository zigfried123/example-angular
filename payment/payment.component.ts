import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as globals from '../../globals';
import { PaymentService } from './payment.service';
import { ServiceUser } from '../service/service-user/service-user';
import { ServiceUserService } from '../service/service-user/service-user.service';
import { DataTransformService, HttpHandlerService, StateManagerService } from '../../shared';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input() userId = null;

  localGlobals: any = globals;

  serviceUsers: any[] = [];
  displayDialog: boolean;

  currentPage: number;
  totalRecords: number = 0;
  firstRowIndex: number = 0;

  constructor(
    public stateManagerService: StateManagerService,
    public serviceUserService: ServiceUserService,
    public httpHandlerService: HttpHandlerService,
    public paymentService: PaymentService,
    public router: Router,
    public dataTransformService: DataTransformService
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

    let params = [
      { name: 'right_join[payment]', value: 'service_user_id' }
    ];
    if(this.userId) params.push({ name: 'user_id', value: this.userId });
    this.serviceUserService.search(this.currentPage, respHandler, params).subscribe(
        serviceUsers => {
          this.serviceUsers = serviceUsers;
        },
        err => console.error(err)
    );
    
  }

  /**
   * On client click
   */
  onClientLinkClick(clientId) {
    this.router.navigate(['/dashboard/user', clientId]);
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
