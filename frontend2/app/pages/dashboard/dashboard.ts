import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    pipes: [TranslatePipe]
})
export class DashboardPage {
    translate: TranslateService;

    constructor(private nav: NavController, private navParams: NavParams, translate: TranslateService) {
        this.translate = translate;
    }

    goToPage(page) {
        this.nav.push(page);
    }
}
