import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {OutcomeProvider} from "../../../providers/outcome";

@Component({
    templateUrl: 'config.html',
})
export class OutcomeConfigPage {
    outcome: any;

    constructor(private nav: NavController, private navParams: NavParams, outcomeData: OutcomeProvider, http: Http) {
        this.outcome = this.navParams.data;
        outcomeData.getSingle(this.outcome.id).then(outcome => {
            this.outcome = outcome;
        });
    }
}