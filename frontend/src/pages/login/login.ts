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

    constructor(private nav: NavController, private userData: SessionProvider, private config: Config) {
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.userData.login(this.login.username, this.login.password);
            this.nav.push(TabsPage);
        }
    }

    onLogout() {
        this.userData.logout();
        this.nav.push(TabsPage);
    }
}
