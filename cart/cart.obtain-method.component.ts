import {Component, Injector, Input, ViewChild} from '@angular/core';
import {CartCommonComponent} from "./cart.common.component";
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material";
import {FormControl} from "@angular/forms";
import * as moment from 'moment';
import {Moment} from "moment";
import {YandexDelivery} from "./cart-data-service";
import {AddressSuggestionData} from "../common/address-suggestions";

class YandexDeliveryType {
    public id: number;
    public name: number;
}

@Component({
    selector: 'cart-obtain-method',
    templateUrl: './cart.obtain-method.component.html',
})
export class CartObtainMethodComponent extends CartCommonComponent {
    newDeliveryAddress: AddressSuggestionData;

    deliveryDateControl = new FormControl();

    private static today = moment().startOf("day");

    deliveryDateFilter = (d: Moment): boolean => {
        let address = this.data.getDeliveryAddress();
        return address.Dates.map(x => x.isSame(d)).filter(x => x).length > 0;
    };

    constructor(injector: Injector) {
        super(injector);

        this.deliveryDateControl.setValue(this.cart.deliveryDate);

        let _this = this;
        this.data.setDeliveryDateNotify.subscribe(
            x => {
                _this.deliveryDateControl.setValue(_this.cart.deliveryDate);
            }, e => {

            });
    }

    addDeliveryAddress() {
        let _this = this;
        this.data.addDeliveryAddress(this.newDeliveryAddress, function (result) {
            if (result) {
                _this.data.clearDeliveryAddressNotify.emit();
                _this.newDeliveryAddress = null;
            }
        });
    }

    onAddressChangeNotify(message: AddressSuggestionData) {
        this.newDeliveryAddress = message;
    }
}
