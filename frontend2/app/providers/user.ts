import {Injectable} from "@angular/core";
import {Events, LocalStorage, Storage} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Config} from "./config";
import {DataModel} from "./data-model";

interface StoredUser {
    first: string;
    last: string;
    role: string;
    jobTitle: string;
    orgName: string;
    orgId: number;
    roleName: string;
}

@Injectable()
export class UserProvider extends DataModel {
    public storedUser: StoredUser = {first: '', last: '', role: '', jobTitle: '', orgName: '', orgId: 0, roleName: ''};

    public first: string = '';
    public last: string = '';
    public role: string = '';
    public jobTitle: string = '';
    public orgName: string = '';
    public orgId: number = 0;
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
                var data = jsonInfo.data;
                this.first = data.fn;
                this.last = data.ln;
                this.role = data.r;
                this.jobTitle = data.jt;
                this.orgName = data.o;
                this.orgId = data.oi;
                this.storedUser = {first: data.fn, last: data.ln, role: data.r, jobTitle: data.jt, orgName: data.o, orgId: data.oi, roleName: data.rn};
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
            this.http.post('/api3/session/login', data, null).subscribe(res => {
                var jsonResponse = res.json();
                this.validate(jsonResponse);
                resolve(jsonResponse);
            });
        });
    }

    logout() {
        this.isLoggedIn = false;
        this.storage.set('user', null);
        this.events.publish('user:logout');
    }

    checkLogin() {
        return this.storage.get('user').then((value) => {
            console.log('checkLogin():', value);
            if (value) {
                this.storedUser = JSON.parse(value);
                console.log('STORED:', this.storedUser);
                this.first = this.storedUser.first;
                this.last = this.storedUser.last;
                this.role = this.storedUser.role;
                this.jobTitle = this.storedUser.jobTitle;
                this.orgName = this.storedUser.orgName;
                this.orgId = this.storedUser.orgId;
                this.isLoggedIn = true;
                this.events.publish('user:login');
            }
            return value;
        });
    }
}
