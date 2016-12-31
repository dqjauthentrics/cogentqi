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
        outcomeProvider.byOrganization(session.user.organizationId).then((outcomes:any) => {
            this.outcomes = outcomes;
            this.loading = false;
        });
    }
}
