import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PersonalPaymentComponent } from './personal-payment.component';
import { PaymentService } from './payment.service';
import { PaymentServiceStub } from './payment.service.stub';
import { AuthService, AuthServiceStub, DataTransformService, HttpClientService, HttpHandlerService, 
         LocalStorageService, PrimengSharedModule, SharedModule, StateManagerService } from '../../shared';

let comp:    PersonalPaymentComponent;
let fixture: ComponentFixture<PersonalPaymentComponent>;

describe('PersonalPaymentComponent', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ PersonalPaymentComponent ],
            imports: [ 
                FormsModule,
                NoopAnimationsModule,
                PrimengSharedModule,
                SharedModule
            ],
            providers: [
                BaseRequestOptions,
                DataTransformService,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [ MockBackend, BaseRequestOptions ]
                },
                HttpClientService,
                HttpHandlerService,
                LocalStorageService,
                MockBackend,
                StateManagerService
            ]
        });

        TestBed.overrideComponent(PersonalPaymentComponent, {
        set: {
            providers: [
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: PaymentService, useClass: PaymentServiceStub },
                { provide: Router, useValue: { url: '/dashboard/personal-payment' }}
            ]
        }
        });

        fixture = TestBed.createComponent(PersonalPaymentComponent);

        comp = fixture.componentInstance;

    });

    it('test ngOnInit on execute defines initial variables', () => {
        
        fixture.detectChanges();

        expect(comp.currentPage).toBeDefined();
        expect(comp.firstRowIndex).toBeDefined();
        expect(comp.personalPayments).toBeDefined();
    });

    it('test paginate on execute changes current page number', () => {

        fixture.detectChanges();

        // set page index
        let event = { page: 1 };

        comp.paginate(event);
        
        expect(comp.currentPage).toEqual(2);
    });

});
