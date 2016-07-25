import {Injectable} from "@angular/core";
import {Events, LocalStorage, Storage} from "ionic-angular";


@Injectable()
export class UserData {
    fn: string = 'Dave';
    ln: string = 'QJ';
    r: string = 'Administrator';
    jt: string = 'Puba';

    _favorites = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    isLoggedIn: boolean = false;
    storage = new Storage(LocalStorage);

    constructor(private events: Events) {
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

    login(username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.isLoggedIn = true;
        this.setUsername(username);
        this.events.publish('user:login');
    }

    signup(username) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:signup');
    }

    logout() {
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
