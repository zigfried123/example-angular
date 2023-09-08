import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class DataService{

    constructor(private http: HttpClient,  private route: ActivatedRoute) {
    }

    getOmdbUrl(){
        return 'http://www.omdbapi.com/?apikey=4eed3fc1';
    }

    getFilms(val:string): Observable<any>{

        return this.http.get(this.getOmdbUrl()+'&s='+val);
    }

    getFilmById(id:string){
        return this.http.get(this.getOmdbUrl()+'&i='+id);
    }

}
