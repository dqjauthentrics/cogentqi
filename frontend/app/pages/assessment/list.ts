import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {UserProvider} from "../../providers/user";
import {AssessmentDetailPage} from "./detail";

@Component({
    templateUrl: 'build/pages/assessment/list.html',
})

export class AssessmentListPage {
    assessments = [];

    constructor(private nav: NavController, private user: UserProvider, assessmentData: AssessmentProvider) {
        //@todo Use valid organization Id
        var organizationId = 3; //user.oi;
        assessmentData.getAll('/' + organizationId).then(assessments => {
            this.assessments = assessments;
        });
    }

    goToDetail(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

}
