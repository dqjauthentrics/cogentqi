import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";

@Component({
    templateUrl: 'list.html',
})

export class AssessmentListPage {
    public loading: boolean = false;
    public assessments = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, private session: SessionProvider, assessmentData: AssessmentProvider, public icon: IconProvider) {
        this.loading = true;
        assessmentData.getAll('/' + session.user.organizationId, false).then(assessments => {
            this.assessments = assessments;
            this.loading = false;
        });
    }

}
