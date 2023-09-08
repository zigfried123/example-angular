import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent }   from './app.component';
import {DataService} from "./data.service";
import {HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSliderModule} from "@angular/material/slider";
import { MatIconModule } from '@angular/material/icon';
import {LocalStorageService} from "./local-storage.service";
import {SearchFilmComponent} from "./search-film.component";
import {RouterModule, Routes} from "@angular/router";
import {AboutComponent} from "./about.component";
import {UserComponent} from "./user.component";
import {FormComponent} from "./common/form.component";
import {UserService} from "./user.service";
import {WalletService} from "./wallet.service";
import {WalletComponent} from "./wallet.component";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";


const appRoutes: Routes =[
    { path: '*', component: AppComponent},
    { path: 'search-film', component: SearchFilmComponent},
    { path: 'user/register', component: UserComponent},
    { path: 'user/wallet', component: WalletComponent},
    { path: 'form', component: FormComponent},
    { path: 'about/:id', component: AboutComponent},
    //{ path: '**', component: NotFoundComponent }
];

@NgModule({
    imports:      [BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, HttpClientModule, ReactiveFormsModule, MatSliderModule, MatFormFieldModule, MatAutocompleteModule,  MatInputModule, BrowserAnimationsModule,  MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
    exports: [  ],
    declarations: [ AppComponent, SearchFilmComponent, AboutComponent, UserComponent, FormComponent, WalletComponent],
    bootstrap:    [ AppComponent ],
    providers: [DataService, UserService, WalletService, LocalStorageService, HttpClientModule]
})
export class AppModule { }
