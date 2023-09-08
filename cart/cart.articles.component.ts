import {Component, Injector} from '@angular/core';
import {CartCommonComponent} from "./cart.common.component";

@Component({
    selector: 'cart-articles',
    templateUrl: './cart.articles.component.html',
})
export class CartArticlesComponent extends CartCommonComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    private quantityChanged(id, quantity) {
        this.data.setArticleQuantity(id, quantity);
    }

    private deleteArticle(id) {
        this.data.deleteArticle(id);
    }
}
