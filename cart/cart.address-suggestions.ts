import {Component, Injector, EventEmitter, Injectable} from "@angular/core";
import {ClearDeliveryAddressInterface} from "../common/address-suggestions";
import {CartDataService} from "./cart-data-service";

@Injectable()
export class CartAddressSuggestions implements ClearDeliveryAddressInterface {
    public clearDeliveryAddressNotify: EventEmitter<void> = new EventEmitter<void>();

    constructor(private cartDataService: CartDataService) {
        let _this = this;
        cartDataService.clearDeliveryAddressNotify.subscribe(
            x => _this.clearDeliveryAddressNotify.emit()
        );
    }
}
