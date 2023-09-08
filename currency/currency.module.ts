import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CurrencyComponent } from './currency.component';
import { CurrencyService } from './currency.service';
import { PrimengSharedModule, SharedModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimengSharedModule,
    SharedModule
  ],
  declarations: [
    CurrencyComponent
  ],
  providers: [
    CurrencyService
  ]
})
export class CurrencyModule { }
