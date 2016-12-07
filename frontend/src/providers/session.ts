import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Events} from "ionic-angular";
import {Http} from "@angular/http";
import {Config} from "./config";
import {DataModel} from "./data-model";

@Injectable()
export class SessionProvider extends DataModel {
    public user: any = null;
    public isLoggedIn: boolean = false;
    private storage = new Storage();
    public loginError: string = 'okay';

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
            let data = {username: username, password: password};
            this.http.post('/assets/api/session/login', data, null).subscribe(res => {
                let jsonResponse = res.json();
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
                if (this.user.id) {
                    this.isLoggedIn = true;
                    this.events.publish('user:login');
                }
                else {
                    this.isLoggedIn = false;
                }
            }
            else {
                this.isLoggedIn = false;
            }
            return value;
        });
    }
}
