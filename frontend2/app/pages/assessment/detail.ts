import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";

@Component({
    templateUrl: 'build/pages/assessment/detail.html'
})
export class AssessmentDetailPage {
    assessment: any;

    constructor(private nav: NavController, private navParams: NavParams, assessmentData: AssessmentProvider) {
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(assessment => {
            this.assessment = assessment;
        });
    }

    goToAssessment(assessment) {
        alert(assessment.instrument.name);
    }
}
