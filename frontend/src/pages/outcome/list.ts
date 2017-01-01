import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {OutcomeProvider} from "../../providers/outcome";
import {IconProvider} from "../../providers/icon";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'list.html'
})
export class OutcomeListPage {
    public outcomes = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, private session: SessionProvider, private outcomeProvider: OutcomeProvider, public icon: IconProvider) {
        this.loading = true;
        outcomeProvider.getAll(null, true).then((outcomes: any) => {
            for (let outcome of outcomes) {
                outcome.intLevel = outcome.level * 100;
            }
            this.outcomes = outcomes;
            console.log(this.outcomes);
            this.loading = false;
        });
    }

    setValue(outcome) {
        outcome.dirty = true;
        outcome.level = outcome.intLevel / 100;
    }

    getClass(outcome) {
        if (!outcome || outcome.level <= 0.2) {
            return 'Unacceptable';
        }
        else if (outcome.level <= 0.3) {
            return 'Acceptable';
        }
        else if (outcome.level <= 0.6) {
            return 'Good';
        }
        else {
            return 'Excellent';
        }
    }

    prettyLevel(outcome) {
        return Math.round(outcome.level * 100);
    }

    levelPhrase(outcome) {
        return this.getClass(outcome) + ' (' + this.prettyLevel(outcome) + ')';
    }

    isLocked(outcome) {
        return outcome.method === this.outcomeProvider.METHOD_DATA;
    }
}
