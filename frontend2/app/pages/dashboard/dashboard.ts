import {UserData} from "../../providers/user";
import {Config} from "../../providers/config";
import {Replace} from "../../pipes/strings";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
//import {TranslateService} from "ng2-translate/ng2-translate";

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    pipes: [Replace]
})
export class DashboardPage {

    constructor(private config: Config,
                private nav: NavController,
                private navParams: NavParams,
                //private translate: TranslateService,
                private user: UserData) {
    }

    goToPage(page) {
        this.nav.push(page);
    }
}
