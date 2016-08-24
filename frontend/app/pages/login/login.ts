import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {TabsPage} from "../tabs/tabs";
import {SessionProvider} from "../../providers/session";
import {Config} from "../../providers/config";

@Component({
    templateUrl: 'build/pages/login/login.html',
    pipes: [TranslatePipe]
})
export class LoginPage {
    login: {username?: string, password?: string} = {};
    submitted = false;

    constructor(private nav: NavController, private translate: TranslateService, private userData: SessionProvider, private config: Config) {
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
