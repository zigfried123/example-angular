import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "./data.service";

export class Film{
    poster: string;
    title: string;
    actors: string[] = [];
    year: string;
    country: string;
    director: string;
    writer: string;
}

@Component({
    selector: 'about',
    styleUrls: ['./about.component.css'],
    templateUrl: './about.component.html',
    providers: [Film],
})

export class AboutComponent implements OnInit{

    constructor(private data: DataService, private activateRoute: ActivatedRoute, private film: Film){
    }

    ngOnInit(): void {
        this.renderFilm();
    }

    renderFilm() {
        let id = this.activateRoute.snapshot.params['id'];

        this.data.getFilmById(id).subscribe((x: any) => {

            this.film.title = x.Title;
            this.film.poster = x.Poster;
            this.film.actors = x.Actors.split(', ');
            this.film.year = x.Year;
            this.film.country = x.Country;
            this.film.director = x.Director;
            this.film.writer = x.Writer;

        });
    }
}