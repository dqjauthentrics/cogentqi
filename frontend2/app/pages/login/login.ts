import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {SignupPage} from "../signup/signup";
import {TabsPage} from "../tabs/tabs";
import {UserData} from "../../providers/user";

@Component({
    templateUrl: 'build/pages/login/login.html',
    pipes: [TranslatePipe]
})
export class LoginPage {
    login: {username?: string, password?: string} = {};
    submitted = false;

    constructor(private nav: NavController, private translate: TranslateService, private userData: UserData) {
    }

    onLogin(form) {
        this.submitted = true;

        if (form.valid) {
            this.userData.login(this.login.username);
            this.nav.push(TabsPage);
        }
    }

    onLogout() {
        this.userData.logout();
        this.nav.push(TabsPage);
    }

    onSignup() {
        this.nav.push(SignupPage);
    }
}
