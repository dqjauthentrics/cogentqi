import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {AssessmentDetailPage} from "./detail";

@Component({
    templateUrl: 'build/pages/assessment/list.html'
})
export class AssessmentListPage {
    assessments = [];

    constructor(private nav: NavController, assessmentData: AssessmentProvider) {
        var organizationId = 7;
        assessmentData.getAll('/' + organizationId).then(assessments => {
            this.assessments = assessments;
        });
    }

    goToDetail(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

}
