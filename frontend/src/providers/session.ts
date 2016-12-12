import {Injectable} from "@angular/core";
import {Events, AlertController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import {Config} from "./config";
import {Globals} from "./globals";
import {DataModel} from "./data-model";

@Injectable()
export class SessionProvider extends DataModel {
    public user: any = null;
    public isLoggedIn: boolean = false;
    private storage = new Storage();

    public loginError: string = 'okay';

    constructor(protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('user', alertCtrl, http, globals, config);
        this.checkLogin();
    }

    validate(jsonInfo, refresh) {
        this.loginError = null;
        if (this.globals.debug) {
            console.log('SessionProvider:validate(entry)');
        }
        if (jsonInfo && jsonInfo.data) {
            if (!jsonInfo.status) {
                if (this.globals.debug) {
                    console.log('SessionProvider:validate(logout)');
                }
                if (this.isLoggedIn) {
                    this.logout();
                }
            }
            else {
                this.user = jsonInfo.data;
                if (this.user.id) {
                    this.storage.set('user', JSON.stringify(this.user));
                    this.isLoggedIn = true;
                    if (this.globals.debug) {
                        console.log('SessionProvider:validate(logged in, published)');
                    }
                    this.events.publish('session:login');
                }
                else {
                    this.loginError = 'Unable to locate user with those credentials.';
                    this.logout();
                }
            }
        }
        else {
            if (!refresh) {
                this.loginError = 'Unable to log into server.';
            }
            if (this.isLoggedIn) {
                this.logout();
            }
        }
    }

    refreshUser() { // for page reload events
        if (this.globals.debug) {
            console.log('SessionProvider:refreshUser(entry)');
        }
        return new Promise(resolve => {
            this.http.post(this.baseUrl + 'refreshUser', null, null).subscribe(res => {
                let jsonResponse = res.json();
                this.validate(jsonResponse, true);
                if (this.globals.debug) {
                    console.log('SessionProvider:refreshUser(validated)');
                }
                resolve(jsonResponse);
            });
        });
    }

    login(username, password) {
        return new Promise(resolve => {
            let data = {username: username, password: password};
            this.http.post(this.baseUrl + 'login', data, null).subscribe(res => {
                let jsonResponse = res.json();
                this.validate(jsonResponse, false);
                resolve(jsonResponse);
            });
        });
    }

    logout() {
        this.isLoggedIn = false;
        this.storage.remove('user');
        this.user = null;
        if (this.globals.debug) {
            console.log('SessionProvider:logout(publish)');
        }
        this.events.publish('session:logout');
    }

    checkLogin() {
        if (this.globals.debug) {
            console.log('SessionProvider:checkLogin(entry)');
        }
        return this.storage.get('user').then((value) => {
            if (value) {
                this.user = JSON.parse(value);
                if (this.user.id) {
                    this.isLoggedIn = true;
                    if (this.globals.debug) {
                        console.log('SessionProvider:checkLogin(publish login)');
                    }
                    this.events.publish('session:login');
                }
            }
            else {
                this.isLoggedIn = false;
            }
            return value;
        });
    }
}
