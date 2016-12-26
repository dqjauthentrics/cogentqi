import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {OutcomeProvider} from "../../../providers/outcome";
import {OutcomeConfigPage} from "./config";
import {IconProvider} from "../../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class CfgOutcomesListPage {
    public outcomes = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, outcomeData: OutcomeProvider, public icon: IconProvider) {
        this.loading = true;
        outcomeData.getAll(null, false).then(outcomes => {
            this.outcomes = outcomes;
            this.loading = false;
        });
    }

    configureOutcome(outcome) {
        this.nav.push(OutcomeConfigPage, outcome);
    }
}


