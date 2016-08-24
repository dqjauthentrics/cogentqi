import {Injectable} from "@angular/core";
import {Events, LocalStorage, Storage} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Config} from "./config";
import {DataModel} from "./data-model";

interface StoredUser {
    id: number;
    first_name: string;
    last_name: string;
    role_id: string;
    job_title: string;
    organization_name: string;
    organization_id: number;
    role_name: string;
}

@Injectable()
export class UserProvider extends DataModel {
    public storedUser: StoredUser = {
        id: 0,
        first_name: '',
        last_name: '',
        role_id: '',
        job_title: '',
        organization_name: '',
        organization_id: 0,
        role_name: ''
    };
    public isLoggedIn: boolean = false;

    private storage = new Storage(LocalStorage);

    constructor(protected http: Http, config: Config, protected events: Events) {
        super('user', http, config, events);
        this.checkLogin();
    }

    validate(jsonInfo) {
        if (jsonInfo && jsonInfo.data) {
            if (!jsonInfo.status) {
                this.logout();
            }
            else {
                this.storedUser = jsonInfo.data;
                this.storage.set('user', JSON.stringify(this.storedUser));
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
        this.storedUser = null;
        this.events.publish('user:logout');
    }

    checkLogin() {
        return this.storage.get('user').then((value) => {
            console.log('checkLogin():', value);
            if (value) {
                this.storedUser = JSON.parse(value);
                console.log('STORED:', this.storedUser);
                this.isLoggedIn = true;
                this.events.publish('user:login');
            }
            return value;
        });
    }
}
