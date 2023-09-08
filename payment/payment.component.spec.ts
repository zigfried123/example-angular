import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PaymentComponent } from './payment.component';
import { PaymentService } from './payment.service';
import { PaymentServiceStub } from './payment.service.stub';
import { ServiceUserService, ServiceUserServiceStub } from '../service';
import { AuthService, AuthServiceStub, DataTransformService, HttpClientService, HttpHandlerService, 
         LocalStorageService, PrimengSharedModule, SharedModule, StateManagerService } from '../../shared';

let comp:    PaymentComponent;
let fixture: ComponentFixture<PaymentComponent>;
let serviceUserServiceStub: ServiceUserServiceStub = new ServiceUserServiceStub();

describe('PaymentComponent', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ PaymentComponent ],
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

        TestBed.overrideComponent(PaymentComponent, {
        set: {
            providers: [
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: PaymentService, useClass: PaymentServiceStub },
                { provide: Router, useValue: { url: '/dashboard/payment', navigate: () => {} }},
                { provide: ServiceUserService, useClass: ServiceUserServiceStub }
            ]
        }
        });

        fixture = TestBed.createComponent(PaymentComponent);

        comp = fixture.componentInstance;

    });

    it('test ngOnInit on execute defines initial variables', () => {
        
        fixture.detectChanges();

        expect(comp.currentPage).toBeDefined();
        expect(comp.firstRowIndex).toBeDefined();
        expect(comp.serviceUsers.length).toBeGreaterThan(0);
    });

    it('test onClientLinkClick on execute navigates to user profile', () => {

        let router = fixture.debugElement.injector.get(Router);
        spyOn(router, 'navigate').and.returnValue(null);

        fixture.detectChanges();

        comp.onClientLinkClick(1);

        expect(router.navigate).toHaveBeenCalledWith(['/dashboard/user', 1]);
    });

    it('test paginate on execute changes current page number', () => {

        fixture.detectChanges();

        // set page index
        let event = { page: 1 };

        comp.paginate(event);
        
        expect(comp.currentPage).toEqual(2);
    });

});
