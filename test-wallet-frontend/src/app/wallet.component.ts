import {Component, OnInit} from '@angular/core';
import {WalletService} from "./wallet.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html'
})
export class WalletComponent implements OnInit {

    balance: string;
    walletId: number;

    walletForm: FormGroup;

    constructor(private service: WalletService, private fb: FormBuilder) {
    }

    ngOnInit(): void {

        this.walletForm = this.fb.group({
            sum: [0],
            currency: [1],
            reason: [1],
            transactionType: [1]
        });

        this.service.getLastWalletId().subscribe((x:any) => {
                this.walletId = x;
                this.service.getBalance(this.walletId).subscribe((x: any) => this.balance = x.balance);
            }
        );
    }

    submit(form: any) {

        console.log(this.walletId);

        this.service.changeBalance(this.walletId, form.value).subscribe((x: any) => {
            this.balance = x.balance;
        }, error => {
            //console.log(error)
        });

    }

}
