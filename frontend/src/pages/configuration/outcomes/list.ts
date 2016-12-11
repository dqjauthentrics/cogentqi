import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {OutcomeProvider} from "../../../providers/outcome";
import {OutcomeConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgOutcomesListPage {
    outcomes = [];
    queryText: string;

    constructor(private nav: NavController, outcomeData: OutcomeProvider) {
        outcomeData.getAll(null, false).then(outcomes => {
            this.outcomes = outcomes;
        });
    }

    configureOutcome(outcome) {
        this.nav.push(OutcomeConfigPage, outcome);
    }
}


