import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {SessionProvider} from "../../providers/session";
import {AssessmentDetailPage} from "./detail";

@Component({
    templateUrl: 'build/pages/assessment/list.html',
})

export class AssessmentListPage {
    assessments = [];

    constructor(private nav: NavController, private session: SessionProvider, assessmentData: AssessmentProvider) {
        var organizationId = session.user.organization_id;
        assessmentData.getAll('/' + organizationId).then(assessments => {
            this.assessments = assessments;
        });
    }

    goToDetail(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

}
