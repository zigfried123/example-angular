import {HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class UserService {

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    register(data:any) {
        let body = JSON.stringify(data);
        return this.http.post('http://test-wallet-backend/index.php/user/register', body);
    }

}
