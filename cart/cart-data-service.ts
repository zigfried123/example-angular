import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {NgxUiLoaderService} from "ngx-ui-loader";
import * as moment from 'moment';
import {Moment} from "moment";
import {OkDialog} from "../common/ok-dialog";
import {MatDialog} from "@angular/material";
import {AddressSuggestionData} from "../common/address-suggestions";
import {AppConfig} from "../app-config";
import {RequestOptions} from "@angular/http";

export class CartDeliveryAddress {
    public Id: number;
    public City: string;
    public CityKladrId: string;
    public Dates: Moment[];
    public Address: string;
    public Latitude: number;
    public Longitude: number;
    public LocationId: number;
}

export class CartDeliveryTimeRange {
    public id: number;
    public name: string;
    public time_from: string;
    public time_to: string;
}

export class CartArticle {
    public id: number;
    public name: string;
    public price: number;
    public quantity: number;
    public amount: number;
    public url: string;

    // non persistent
    public stockAvailable: number;
}

export class Cart {
    public articles: CartArticle[];
    public paymentType: number; // CartPaymentType
    public obtainMethod: string; // CartObtainMethod
    public deliveryOption: string; // CartDeliveryOption
    public deliveryAddressId?: number;
    public deliveryTimeRangeId?: number;
    public yandexDeliveryTypeId?: number;
    public deliveryDate: Moment;
    public yandexDelivery: YandexDelivery;
    public comment: string; // comment

    public deliveryAmount: number;

    // auto-calc
    public articlesAmount: number;
    public amount: number;
}

export enum CartStep {
    Articles, ObtainMethod, PaymentType
}

export class CartDeliveryOption {
    public static Own: string = "own";
    public static Outsource: string = "outsource";
    public static Hybrid: string = "hybrid";
}

export class CartObtainMethod {
    public static OwnStorePickup: string = "ownStorePickup";
    public static Delivery: string = "delivery";
    public static SimplifiedShipping: string = "simplified_shipping";
}

export class CartPaymentType {
    public static Cash: number = 1;
    public static Cashless: number = 2;
}

class CartOrderResult {
    public status: string;
    public successUrl: string;
    public draftedArticles: CartOrderResultDraftedArticles[];
}

class CartDraftResult {
    public successUrl: string;
}

class CartOrderResultDraftedArticles {
    public Id: number;
    public DraftedQuantity: number;
    public TotalQuantity: number;
}

class CartAddDeliveryResult {
    public id: number;
    public addresses: CartDeliveryAddress[];
}

export class YandexDelivery {
    public CompanyName: string;
    public Cost: number;
    public CostWithRules: number;
    public Days: string;
    public DeliveryDates: Moment[];
    public DeliveryId: number;
    public DeliveryUniqName: string;
    public Direction: number;
    public Intervals: YandexDeliveryInterval[];
    public MaxDays: number;
    public MinDays: number;
    public TariffId: number;
    public TariffName: string;

    // local
    public SelectedIntervalId: number;
}

class YandexDeliveryInterval {
    public Id: number;
    public Day: string;
    public Interval: string;
}

@Injectable()
export class CartDataService {
    public cart: Cart;
    public outOfStock: boolean = false;
    public deliveryAddresses: CartDeliveryAddress[];
    public deliveryTimeRanges: CartDeliveryTimeRange[];
    public yandexDeliveries: YandexDelivery[] = null;

    public clearDeliveryAddressNotify: EventEmitter<void> = new EventEmitter<void>();
    public setDeliveryDateNotify: EventEmitter<void> = new EventEmitter<void>();

    // persistent cache of selected intervals
    public yandexDeliveriesIntervalsCache: YandexDelivery[] = [];

    private _step: CartStep = CartStep.Articles;
    private loadexInx = 0;

    get step() {
        return this._step;
    }

    constructor(private http: HttpClient, private ngxService: NgxUiLoaderService, private dialog: MatDialog) {
    }

    changeStep(step: CartStep) {
        if (step == CartStep.ObtainMethod) {
            if (this.cart.deliveryAddressId) {
                this.getYandexDeliveries();
            } else {
                this.yandexDeliveries = null;
            }
        }

        // Check required properties
        if (step == CartStep.PaymentType) {
            if (this.cart.obtainMethod == CartObtainMethod.Delivery) {
                if (!this.cart.deliveryAddressId) {
                    this.showErrorDialog("Не выбран адрес доставки!");
                    return;
                }

                if (this.cart.deliveryOption == CartDeliveryOption.Own) {
                    if (this.getDeliveryAddress().Dates.map(x => x.isSame(this.cart.deliveryDate)).filter(x => x).length == 0) {
                        this.showErrorDialog("Неверная дата доставки!");
                        return;
                    }

                    if (!this.cart.deliveryTimeRangeId) {
                        this.showErrorDialog("Не выбрано время доставки!");
                        return;
                    }

                    // change step after call
                    let _this = this;
                    this.getDelivery(function (result) {
                        if (result) {
                            _this._step = step;
                        }
                    });

                    return;
                } else if (this.cart.deliveryOption == CartDeliveryOption.Outsource) {
                    if (!this.cart.yandexDelivery) {
                        this.showErrorDialog("Не выбрана служба доставки!");
                        return;
                    }
                }
            }
        }

        this._step = step;
    }

    initCart(cartPreload: Cart, cartDeliveryAddressesPreload: any, cartDeliveryTimeRangesPreload: any) {
        cartPreload.deliveryDate = moment(cartPreload.deliveryDate);

        if (cartPreload.yandexDelivery != null) {
            cartPreload.yandexDelivery.DeliveryDates = cartPreload.yandexDelivery.DeliveryDates.map(v => moment(v));
        }

        this.cart = cartPreload;
        this.deliveryAddresses = cartDeliveryAddressesPreload;
        this.deliveryAddresses.forEach(x => {
            x.Dates = x.Dates.map(d => moment(d));
        });
        this.deliveryTimeRanges = cartDeliveryTimeRangesPreload;
        this.calculateAmount();
    }

    order() {
        this.startLoader();
        this.outOfStock = false;
        this.cart.articles.forEach(x => x.stockAvailable = null);

        this.http.post<CartOrderResult>('/cart/order', {paymentType: this.cart.paymentType, comment: this.cart.comment})
            .subscribe(x => {
                console.log("order", x);
                if (x.status == "OK") {
                    window.location.href = x.successUrl;
                    return;
                } else if (x.status == "OutOfStock") {
                    this.outOfStock = true;
                    x.draftedArticles.forEach(d => {
                        let article = this.cart.articles.find(f => f.id == d.Id);
                        article.stockAvailable = d.TotalQuantity - d.DraftedQuantity;
                    });

                    this.changeStep(CartStep.Articles);
                } else {
                    this.showErrorDialog("Неизвестный результат");
                }

                this.stopLoader();
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);
            });
    }

    saveDraft() {
        this.startLoader();

        this.http.post<CartDraftResult>('/cart/draft', {})
            .subscribe(x => {
                console.log("order", x);
                if (x.successUrl) {
                    window.location.href = x.successUrl;
                    return;
                } else {
                    this.showErrorDialog("Неизвестный результат");
                }

                this.stopLoader();
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);
            });
    }

    getDeliveryAddress() {
        let address = this.deliveryAddresses.find(x => x.Id == this.cart.deliveryAddressId);
        if (!address) {
            return null;
        }

        return address;
    }

    addDeliveryAddress(newDeliveryAddress: AddressSuggestionData, callback) {
        this.startLoader();
        // this.blockUI.start('Обработка...');
        return this.http.post<CartAddDeliveryResult>('/cart/add-delivery-address', newDeliveryAddress)
            .subscribe(x => {
                console.log('add-delivery-address', x);
                this.deliveryAddresses = x.addresses;
                this._setDeliveryAddress(x.id);

                this.getYandexDeliveries();
                this.stopLoader();

                callback(true);
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);

                callback(false);
            });
    }

    setObtainMethod(obtainMethod: string) {
        this.cart.obtainMethod = obtainMethod;
        this.calculateAmount();
        return this.http.post('/cart/set-obtain-method', {method: obtainMethod})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setDeliveryOption(deliveryOption: string) {
        this.cart.deliveryOption = deliveryOption;
        this.calculateAmount();
        return this.http.post('/cart/set-delivery-option', {option: deliveryOption})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setDeliveryAddress(id: number) {
        this.startLoader();
        this._setDeliveryAddress(id);
        return this.http.post('/cart/set-delivery-address', {id: id})
            .subscribe(x => {
                this.getYandexDeliveries();
                this.stopLoader();
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);
            });
    }

    setYandexDeliveryType(id: number) {
        this.cart.yandexDeliveryTypeId = id;
        return this.http.post('/cart/set-yandex-delivery-type', {id: id})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setDeliveryDate(date: Moment) {
        this.cart.deliveryDate = date;
        return this.http.post('/cart/set-delivery-date', {date: date.format()})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setDeliveryTimeRange(id: number) {
        this.cart.deliveryTimeRangeId = id;
        return this.http.post('/cart/set-delivery-time-range', {id: id})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    getDelivery(callback) {
        this.startLoader();

        this.cart.deliveryAmount = null;
        this.http.get<any>('/cart/get-delivery')
            .subscribe(x => {
                this.cart.deliveryAmount = x.Value;
                this.calculateAmount();
                this.stopLoader();
                callback(true);
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);
            });
    }

    setYandexDelivery(delivery: YandexDelivery) {
        this.cart.yandexDelivery = delivery;
        this.calculateAmount();

        this.http.post('/cart/set-yandex-delivery', {delivery: delivery})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setYandexDeliveryInterval(delivery: YandexDelivery, intervalId: number) {
        delivery.SelectedIntervalId = intervalId;

        let intervalCache = this.yandexDeliveriesIntervalsCache.find(x => x.DeliveryId == delivery.DeliveryId && x.TariffId == delivery.TariffId);
        if (intervalCache != null) {
            intervalCache.SelectedIntervalId = intervalId;
        } else {
            intervalCache = new YandexDelivery();
            intervalCache.DeliveryId = delivery.DeliveryId;
            intervalCache.TariffId = delivery.TariffId;
            intervalCache.SelectedIntervalId = intervalId;

            this.yandexDeliveriesIntervalsCache.push(intervalCache);
        }

        this.setYandexDelivery(delivery);
    }

    deleteArticle(id: number) {
        this.calculateAmount();

        return this.http.post('/cart/delete-article', {id: id})
            .subscribe(x => {
                let index = this.cart.articles.findIndex(x => x.id == id);
                if (index >= 0) {
                    this.cart.articles.splice(index, 1);
                }

                this.calculateAmount();
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setArticleQuantity(id: any, quantity: any) {
        let nv = Number(quantity);
        if (Number.isNaN(nv)) {
            nv = 1;
        }

        quantity = nv.valueOf();
        let article = this.cart.articles.find(x => x.id == id);
        article.quantity = nv.valueOf();
        article.amount = article.price * article.quantity;

        this.calculateAmount();

        return this.http.post('/cart/set-article-quantity', {id: id, quantity: quantity})
            .subscribe(x => {
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setPaymentType(id: number) {
        this.cart.paymentType = id;
    }

    changePaymentType(id: number) {
        this.cart.paymentType = id;
        return this.http.post('/cart/set-payment-type', {paymentType: id})
            .subscribe(x => {
                location.reload();
            }, e => {
                console.error(e);
                this.showErrorDialog(e);
            });
    }

    setComment(comment: string) {
        this.cart.comment = comment
    }

    getYandexDeliveries() {
        // disable
        return;

        this.startLoader();

        this.http.get<YandexDelivery[]>('/cart/get-yandex-deliveries')
            .subscribe(x => {
                let yandexDelivery = this.cart.yandexDelivery;

                x.forEach(d => {
                    d.DeliveryDates = d.DeliveryDates.map(v => moment(v));
                    d.SelectedIntervalId = d.Intervals[0].Id;

                    let intervalCache = this.yandexDeliveriesIntervalsCache.find(x => x.DeliveryId == d.DeliveryId && x.TariffId == d.TariffId);
                    if (intervalCache != null) {
                        d.SelectedIntervalId = intervalCache.SelectedIntervalId;
                    }

                    if (this.cart.yandexDelivery != null && d.DeliveryId == this.cart.yandexDelivery.DeliveryId && d.TariffId == this.cart.yandexDelivery.TariffId) {
                        d.SelectedIntervalId = this.cart.yandexDelivery.SelectedIntervalId;
                    }
                });

                // selected delivery not found in new list
                if (yandexDelivery && !x.find(d => d.DeliveryId == yandexDelivery.DeliveryId && d.TariffId == yandexDelivery.TariffId)) {
                    yandexDelivery = null;
                    this.setYandexDelivery(null);
                }

                // only one delivery
                if (x.length == 1 && (!yandexDelivery || yandexDelivery.DeliveryId != x[0].DeliveryId || yandexDelivery.TariffId != x[0].TariffId)) {
                    yandexDelivery = x[0];
                }

                this.setYandexDelivery(yandexDelivery);
                this.yandexDeliveries = x;
                this.stopLoader();
            }, e => {
                console.error(e);
                this.stopLoader();
                this.showErrorDialog(e);
            });
    }

    clearDeliveryAddress() {
        this.clearDeliveryAddressNotify.emit();
    }

    importArticles(event) {
        console.log("uploadCart", event);
        console.log("event.target", event.target);
        console.log("event.target.files", event.target.files);
        if (event.target.files.length > 0) {
            this.startLoader();

            let file: File = event.target.files[0];

            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);

            let headers = new HttpHeaders();
            /** In Angular 5, including the header Content-Type can invalidate your request */
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            let options = {headers: headers};
            this.http.post<Cart>('/cart/import-articles', formData, options)
                .subscribe(
                    x => {
                        let articles = x.articles;
                        this.cart.articles = articles;
                        this.calculateAmount();
                        this.stopLoader();
                    },
                    e => {
                        console.error(e);
                        this.stopLoader();
                        this.showErrorDialog(e);
                    }
                );
        }

        return true;
    }

    get deliveryAddressLocationId() {
        if (!this.cart.deliveryAddressId) {
            return null;
        }

        // there shouldn't be, but might be
        let address = this.deliveryAddresses.find(x => x.Id == this.cart.deliveryAddressId);
        if (!address) {
            return null;
        }

        return address.LocationId;
    }

    private _setDeliveryAddress(id: number) {
        this.cart.deliveryAddressId = id;

        // update delivery date
        let address = this.getDeliveryAddress();

        // Set today. The date will be checked later
        if (address.Dates.length == 0) {
            this.cart.deliveryDate = moment().startOf("day");;
            this.setDeliveryDateNotify.emit();
            this.setDeliveryDate(this.cart.deliveryDate);
        } else if (!this.cart.deliveryDate || address.Dates.map(x => x.isSame(this.cart.deliveryDate)).filter(x => x).length == 0) {
            // Set the first address date
            this.cart.deliveryDate = address.Dates[0];
            this.setDeliveryDateNotify.emit();
            this.setDeliveryDate(this.cart.deliveryDate);
        }

        // if it's not Moscow obtain method Delivery available only
        // if (this.deliveryAddressLocationId != AppConfig.MoscowLocationId && this.cart.deliveryOption != CartDeliveryOption.Outsource) {
        //     this.setDeliveryOption(CartDeliveryOption.Outsource);
        // }
    }

    private showErrorDialog(message?: any) {
        if (message instanceof HttpErrorResponse) {
            if (message.error && message.error.error) {
                message = message.error.error;
            } else {
                message = null;
            }
        }

        if (!message) {
            message = "Ошибка во время запроса";
        }

        this.dialog.open(OkDialog, {
            width: '250px',
            data: {title: "Ошибка", message: message}
        });
    }

    private calculateAmount() {
        let articlesAmount = 0;
        this.cart.articles.forEach(x => articlesAmount += x.amount);

        if (this.cart.deliveryOption == CartDeliveryOption.Outsource) {
            this.cart.deliveryAmount = this.cart.yandexDelivery != null ? this.cart.yandexDelivery.Cost : 0;
        }

        this.cart.articlesAmount = articlesAmount;
        this.cart.amount = this.cart.articlesAmount;

        // If there's no delivery it might be undefined
        if (this.cart.deliveryAmount) {
            this.cart.amount += this.cart.deliveryAmount;
        }
    }

    private startLoader() {
        if (this.loadexInx == 0) {
            this.ngxService.start();
        }

        this.loadexInx++;
    }

    private stopLoader() {
        this.loadexInx--;
        if (this.loadexInx == 0) {
            this.ngxService.stop();
        }
    }
}
