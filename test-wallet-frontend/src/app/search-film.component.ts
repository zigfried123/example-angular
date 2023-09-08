import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DataService} from "./data.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import * as $ from "jquery";
import {LocalStorageService} from "./local-storage.service";

class Film{
    Title: string;
    Poster: string;
    Type: string;
    Year: string;
    imdbID: string;
}

@Component({
    selector: 'search-film',
    styleUrls: ['search-film.component.css'],
    templateUrl: 'search-film.component.html',
})
export class SearchFilmComponent implements OnInit{

    search = new FormControl('');

    filmSearchList: Film[] = [];

    filmSaved: Film[] = [];

    constructor(private data: DataService, private storage: LocalStorageService) {
    }

    ngOnInit() {
        this.renderFilmsFromStorage();
    }

    renderFilmsFromStorage() {
        if (localStorage['films']) {
            this.filmSaved = JSON.parse(localStorage['films']);
        }
    }

    resetSearchList() {
        this.filmSearchList = [];
    }

    fillSearchList(x: any) {
        let titles:any[] = [];

        x.Search.forEach((x: Film) => {
            if(titles.indexOf(x.Title) == -1) {
                titles.push(x.Title);
                this.filmSearchList.push(x);
            }
        });

    }

    onChangedSearch(event: any) {
        this.data.getFilms(event.target.value).subscribe((x: any) => {

            this.resetSearchList();

            if (x.Search) this.fillSearchList(x);

        });
    }

    isNotRepeatedInStorage(event: MatAutocompleteSelectedEvent) {
        return !this.filmSaved.length || JSON.parse(localStorage['films']).every((x: any) => {
            return JSON.stringify(x) != JSON.stringify(event.option.value)
        });
    }

    onSelected(event: MatAutocompleteSelectedEvent) {

        this.search.setValue(this.search.value.Title);

        if (this.isNotRepeatedInStorage(event)) {

            this.filmSaved.push(event.option.value);

            localStorage['films'] = JSON.stringify(this.filmSaved);
        }

    }

    removeFilm(title: string) {

        this.storage.removeFilmFromStorage(title);

        this.renderFilmsFromStorage();

    }

    resetSearchInput() {
        let search = $('#search');
        search.val('');
        search.focus();
    }


}