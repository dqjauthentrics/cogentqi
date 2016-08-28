import {Injectable} from "@angular/core";
import {Events, LocalStorage, Storage} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Config} from "./config";
import {DataModel} from "./data-model";

@Injectable()
export class SessionProvider extends DataModel {
    public user: any = null;
    public isLoggedIn: boolean = false;
    private storage = new Storage(LocalStorage);

    constructor(protected http: Http, config: Config, protected events: Events) {
        super('user', http, config);
        this.checkLogin();
    }

    validate(jsonInfo) {
        if (jsonInfo && jsonInfo.data) {
            if (!jsonInfo.status) {
                this.logout();
            }
            else {
                this.user = jsonInfo.data;
                this.storage.set('user', JSON.stringify(this.user));
                this.isLoggedIn = true;
                this.events.publish('user:login');
            }
        }
        else {
            this.logout();
        }
    }

    login(username, password) {
        return new Promise(resolve => {
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
            let options = new RequestOptions({headers: headers});
            let data = {username: username, password: password};
            this.http.post('/api/session/login', data, null).subscribe(res => {
                var jsonResponse = res.json();
                this.validate(jsonResponse);
                resolve(jsonResponse);
            });
        });
    }

    logout() {
        this.isLoggedIn = false;
        this.storage.set('user', null);
        this.user = null;
        this.events.publish('user:logout');
    }

    checkLogin() {
        return this.storage.get('user').then((value) => {
            if (value) {
                this.user = JSON.parse(value);
                this.isLoggedIn = true;
                this.events.publish('user:login');
            }
            return value;
        });
    }
}
