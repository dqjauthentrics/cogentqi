import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {OutcomeProvider} from "../../../providers/outcome";
import {OutcomeConfigPage} from "./config";

@Component({
    templateUrl: 'build/pages/configuration/outcomes/list.html'
})
export class CfgOutcomesListPage {
    outcomes = [];

    constructor(private nav: NavController, outcomeData: OutcomeProvider) {
        outcomeData.getAll(null).then(outcomes => {
            this.outcomes = outcomes;
        });
    }

    configureOutcome(outcome) {
        this.nav.push(OutcomeConfigPage, outcome);
    }
}


