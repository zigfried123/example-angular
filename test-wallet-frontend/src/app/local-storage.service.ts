import {Injectable} from "@angular/core";

@Injectable()
export class LocalStorageService{

    removeFilmFromStorage(title:string){

        let films = JSON.parse(localStorage['films']);

        let index = films.findIndex((x: any) => {
            return x.Title == title;
        });

        films.splice(index, 1);

        localStorage['films'] = JSON.stringify(films);
    }
}