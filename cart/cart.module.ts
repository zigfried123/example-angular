import {NgModule} from "@angular/core";
import {CartComponent} from "./cart.component";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CsrfInterceptor} from "../csrf-interceptor";
import {CartObtainMethodComponent} from "./cart.obtain-method.component";
import {CartArticlesComponent} from "./cart.articles.component";
import {CartDataService} from "./cart-data-service";
import {CartPaymentTypeComponent} from "./cart.payment-type.component";
import {AddressSuggestions} from "../common/address-suggestions";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerIntl, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule} from "@angular/material-moment-adapter";
import {UltimateCommonModule} from "../common/ultimate-common.module";
import {CartAddressSuggestions} from "./cart.address-suggestions";

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
    declarations: [
        CartComponent, CartArticlesComponent, CartObtainMethodComponent, CartPaymentTypeComponent
    ],
    entryComponents: [
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgxUiLoaderModule,
        MatDialogModule, MatDatepickerModule, MatMomentDateModule, MatFormFieldModule, MatInputModule,
        UltimateCommonModule
    ],
    providers: [CartDataService,
        {provide: 'ClearDeliveryAddressInterface', useClass: CartAddressSuggestions},
        {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true},
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
        //{provide: MatDatepickerIntl, useClass: MyIntl},
    ],
    bootstrap: [CartComponent]
})
export class CartModule {
}
