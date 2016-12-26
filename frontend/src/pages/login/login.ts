import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {SessionProvider} from "../../providers/session";
import {Config} from "../../providers/config";

@Component({
    templateUrl: 'login.html'
})
export class LoginPage {
    login: {username?: string, password?: string} = {};
    submitted = false;

    constructor(private nav: NavController, public session: SessionProvider, public config: Config) {
        console.log('config:', config);
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.session.login(this.login.username, this.login.password);
            this.nav.push(TabsPage);
        }
    }

    onLogout() {
        this.session.logout();
        this.nav.push(TabsPage);
    }
}