import {Replace} from "../../pipes/strings";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {UserData} from "../../providers/user";

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    pipes: [TranslatePipe, Replace]
})
export class DashboardPage {

    constructor(private nav: NavController, private navParams: NavParams, private translate: TranslateService, private user: UserData) {
    }

    goToPage(page) {
        this.nav.push(page);
    }
}
