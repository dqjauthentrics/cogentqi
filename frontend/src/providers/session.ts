import {Injectable} from "@angular/core";
import {Events, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";
import {Config} from "./config";
import {Globals} from "./globals";

@Injectable()
export class SessionProvider {
    public user: any = null;
    public isLoggedIn: boolean = false;
    private storage = new Storage();

    public loginError: string = 'okay';

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        this.checkLogin();
    }

    validate(jsonInfo, refresh) {
        try {
            this.loginError = null;
            if (this.globals.debug) {
                console.log('SessionProvider:validate(entry)', jsonInfo);
            }
            if (jsonInfo) {
                if (!jsonInfo.status) {
                    if (this.globals.debug) {
                        console.log('SessionProvider:validate(logout)');
                        if (jsonInfo.code === 404) {
                            this.loginError = 'Sorry.  Unable to located member with those credentials.';
                        }
                        else {
                            this.loginError = 'Sorry. Unable to connect to server.';
                        }
                        this.logout();
                    }
                }
                else {
                    if (this.globals.debug) {
                        console.log('SessionProvider:valid login()', jsonInfo);
                    }
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
        catch (exception) {
            console.error('LOGIN ERROR', exception);
        }
    }

    refreshUser() { // for page reload events
        if (this.globals.debug) {
            console.log('SessionProvider:refreshUser(entry)');
        }
        return new Promise(resolve => {
            this.http.post('/assets/api/session/refreshUser', null, null).subscribe(res => {
                try {
                    let jsonResponse = res.json();
                    this.validate(jsonResponse, true);
                    if (this.globals.debug) {
                        console.log('SessionProvider:refreshUser(validated)');
                    }
                    resolve(jsonResponse);
                }
                catch (exception) {
                    console.error("COGIC LOGIN ERROR:", res, exception);
                }
            });
        });
    }

    login(username, password) {
        return new Promise(resolve => {
            this.globals.showLoading('Logging in...');
            let data = {username: username, password: password};
            this.http.post('/assets/api/session/login', data, null)
                .subscribe(res => {
                    try {
                        let jsonResponse = res.json();
                        resolve(jsonResponse);
                    }
                    catch (exception) {
                        console.error("COGIC LOGIN ERROR:", res, exception);
                    }
                })
        }).then((jsonResponse) => {
            this.validate(jsonResponse, false);
        });
    }

    logout() {
        this.isLoggedIn = false;
        this.storage.remove('user');
        this.user = null;
        this.globals.dismissLoading();
        if (this.globals.debug) {
            console.log('SessionProvider:logout(publish)');
        }
        this.events.publish('session:logout');
    }

    checkLogin() {
        try {
            if (this.globals.debug) {
                console.log('SessionProvider:checkLogin(entry)');
            }
            return this.storage.get('user').then((value) => {
                if (value) {
                    this.user = JSON.parse(value);
                    if (this.globals.debug) {
                        console.log('SessionProvider:checkLogin(user)', this.user);
                    }
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
        catch (exception) {
            console.error("COGIC LOGIN ERROR:", exception);
        }
    }
}
