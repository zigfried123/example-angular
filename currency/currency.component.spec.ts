import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, Http } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CurrencyComponent } from './currency.component';
import { CurrencyService } from './currency.service';
import { CurrencyServiceStub } from './currency.service.stub';
import { AuthService, AuthServiceStub, DataTransformService, HttpClientService, HttpHandlerService, 
         LocalStorageService, PrimengSharedModule, SharedModule, StateManagerService } from '../../shared';

let comp:    CurrencyComponent;
let fixture: ComponentFixture<CurrencyComponent>;
let currencyServiceStub: CurrencyServiceStub = new CurrencyServiceStub();

describe('CurrencyComponent', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [ CurrencyComponent ],
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

        TestBed.overrideComponent(CurrencyComponent, {
        set: {
            providers: [
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: CurrencyService, useClass: CurrencyServiceStub },
                { provide: Router, useValue: { url: '/dashboard/currency' }},
            ]
        }
        });

        fixture = TestBed.createComponent(CurrencyComponent);

        comp = fixture.componentInstance;

    });

    it('test ngOnInit on execute defines initial variables', () => {
        
        fixture.detectChanges();

        expect(comp.currentPage).toBeDefined();
        expect(comp.firstRowIndex).toBeDefined();
        expect(comp.currencies).toBeDefined();
    });

    it('test onRowSelect on execute sets currency details', () => {
      
        fixture.detectChanges();

        let event = {
            data: currencyServiceStub.currencies[0]
        };

        comp.onRowSelect(event);

        expect(comp.isNewCurrency).toBeFalsy();
        expect(comp.currency['id']).toBe(currencyServiceStub.currencies[0]['id']);
        expect(comp.displayDialog).toBeTruthy();
    });

    it('test showDialogToAdd on execute sets fresh currency details', () => {
        
        fixture.detectChanges();

        comp.showDialogToAdd();

        expect(comp.isNewCurrency).toBeTruthy();
        expect(comp.currency).toBeDefined();
        expect(comp.currency['is_active']).toEqual(0);
        expect(comp.displayDialog).toBeTruthy();
    });

    it('test save on new currency runs create', () => {

        fixture.detectChanges();

        let currencyService = fixture.debugElement.injector.get(CurrencyService);
        spyOn(currencyService, 'create').and.returnValue(Observable.of(currencyServiceStub.currencies[0]));

        comp.isNewCurrency = true;

        comp.save();

        expect(currencyService.create).toHaveBeenCalled();
        expect(comp.currency).toBeNull();
        expect(comp.displayDialog).toBeFalsy();
    });

    it('test save on existing currency runs update', () => {

        fixture.detectChanges();

        let currencyService = fixture.debugElement.injector.get(CurrencyService);
        spyOn(currencyService, 'update').and.returnValue(Observable.of(currencyServiceStub.currencies[0]));

        comp.isNewCurrency = false;

        comp.save();

        expect(currencyService.update).toHaveBeenCalled();
    });

    it('test delete on execute deletes currency', () => {

        fixture.detectChanges();

        let currencyService = fixture.debugElement.injector.get(CurrencyService);
        spyOn(currencyService, 'delete').and.returnValue(Observable.of(null));

        comp.delete();

        expect(currencyService.delete).toHaveBeenCalled();
        expect(comp.currency).toBeNull();
        expect(comp.displayDialog).toBeFalsy();
    });

    it('test paginate on execute changes current page number', () => {

        fixture.detectChanges();

        // set page index
        let event = { page: 2 };

        comp.paginate(event);
        
        expect(comp.currentPage).toEqual(3);
    });

});
