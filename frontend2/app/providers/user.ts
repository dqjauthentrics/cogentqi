import {Injectable} from "@angular/core";
import {Events, LocalStorage, Storage} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Config} from "./config";
import {DataModel} from "./data-model";

@Injectable()
export class UserProvider extends DataModel {
    fn: string = 'Dave';
    ln: string = 'QJ';
    r: string = 'Administrator';
    jt: string = 'Puba';
    o: string = 'Someplace';

    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    isLoggedIn: boolean = false;
    storage = new Storage(LocalStorage);

    constructor(protected http: Http, config: Config, protected events: Events) {
        super('user', http, config, events);
    }

    hasFavorite(sessionName) {
        return (this._favorites.indexOf(sessionName) > -1);
    }

    addFavorite(sessionName) {
        this._favorites.push(sessionName);
    }

    removeFavorite(sessionName) {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    }

    validate(jsonInfo) {
        if (jsonInfo && jsonInfo.data) {
            var data = jsonInfo.data;
            this.fn = data.fn;
            this.ln = data.ln;
            this.jt = data.jt;
            this.r = data.r;
            this.o = data.o;
            this.storage.set(this.HAS_LOGGED_IN, true);
            this.isLoggedIn = true;
            this.events.publish('user:login');
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
            var postData = 'username=' + username + '&password=' + password;
            this.http.post('http://pharmacy.dev2.cog/api3' + '/session/login', data, null).subscribe(res => {
                var jsonResponse = res.json();
                this.validate(jsonResponse);
                resolve(jsonResponse);
            });
        });
    }

    signup(username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:signup');
    }

    logout() {
        this.isLoggedIn = false;
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.events.publish('user:logout');
    }

    setUsername(username) {
        this.storage.set('username', username);
    }

    getUsername() {
        return this.storage.get('username').then((value) => {
            return value;
        });
    }

    // return a promise
    hasLoggedIn() {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            console.log('hasLoggedIn:', value);
            return value;
        });
    }
}
