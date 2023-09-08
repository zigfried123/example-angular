import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentComponent } from './payment.component';
import { PaymentService } from './payment.service';
import { PersonalPaymentComponent } from './personal-payment.component';
import { PrimengSharedModule, SharedModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    PrimengSharedModule,
    SharedModule
  ],
  declarations: [
    PaymentComponent,
    PersonalPaymentComponent
  ],
  providers: [
    PaymentService
  ],
  exports: [
    PaymentComponent
  ]
})
export class PaymentModule { }
