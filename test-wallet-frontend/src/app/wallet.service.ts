import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class WalletService {

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    getBalance(walletId:number) {
        return this.http.get('http://test-wallet-backend/index.php/wallet/get-balance?walletId='+walletId);
    }

    changeBalance(walletId:number, form:any){
        console.log(walletId);
        let body = JSON.stringify({walletId: walletId, sum: form.sum, currency: form.currency, reasonId: form.reason, transactionType: form.transactionType});
        return this.http.post('http://test-wallet-backend/index.php/wallet/change-balance', body);
    }

    getLastWalletId() {
        return this.http.get('http://test-wallet-backend/index.php/wallet/get-last-wallet-id');
    }

}
