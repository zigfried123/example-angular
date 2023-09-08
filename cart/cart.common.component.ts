import {Injector} from "@angular/core";
import {CartDataService, CartDeliveryOption, CartObtainMethod, CartPaymentType, CartStep} from "./cart-data-service";
import {AppConfig} from "../app-config";

export class CartCommonComponent
{
    // enum && constants
    public AppConfig: typeof AppConfig = AppConfig;
    public CartStep: typeof CartStep = CartStep;
    public CartDeliveryOption: typeof CartDeliveryOption = CartDeliveryOption;
    public CartPaymentType: typeof CartPaymentType = CartPaymentType;
    protected CartObtainMethod: typeof CartObtainMethod = CartObtainMethod;

    public data: CartDataService;
    public appConfig: AppConfig;

    get cart() {
        if (!this.data) {
            return null;
        }

        if (!this.data.cart) {
            return null;
        }

        return this.data.cart;
    }

    get deliveryAddresses() {
        if (!this.data) {
            return null;
        }

        if (!this.data.deliveryAddresses) {
            return null;
        }

        return this.data.deliveryAddresses;
    }

    get isGuest() {
        return this.appConfig.isGuest;
    }

    constructor(private injector: Injector) {
        this.data = injector.get(CartDataService);
        this.appConfig = injector.get('AppConfig');
    }
}