import {Component, Injector} from '@angular/core';
import {CartCommonComponent} from "./cart.common.component";

@Component({
    selector: 'cart-payment-type',
    templateUrl: './cart.payment-type.component.html',
})
export class CartPaymentTypeComponent extends CartCommonComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
