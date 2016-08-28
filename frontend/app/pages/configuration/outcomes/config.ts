import {Component} from "@angular/core";
import {DomSanitizationService} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {OutcomeProvider} from "../../../providers/outcome";

@Component({
    templateUrl: 'build/pages/configuration/outcomes/config.html',
})
export class OutcomeConfigPage {
    outcome: any;

    constructor(private nav: NavController, private navParams: NavParams, outcomeData: OutcomeProvider, http: Http, private sanitizer: DomSanitizationService) {
        this.outcome = this.navParams.data;
        outcomeData.getSingle(this.outcome.id).then(outcome => {
            this.outcome = outcome;
        });
    }
}