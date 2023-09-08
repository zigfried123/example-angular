import {Component, Injector} from '@angular/core';
import {CartCommonComponent} from "./cart.common.component";

// Global variables
declare var cartPreload: any;
declare var cartDeliveryAddressesPreload: any;
declare var cartDeliveryTimeRangesPreload: any;

@Component({
    selector: '#ng-app',
    templateUrl: './cart.component.html',
})
export class CartComponent extends CartCommonComponent {
    constructor(injector: Injector) {
        super(injector);

        this.data.initCart(cartPreload, cartDeliveryAddressesPreload, cartDeliveryTimeRangesPreload);
    }
}
