import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {InstrumentProvider} from "../../providers/instrument";

@Component({
    templateUrl: 'build/pages/assessment/detail.html'
})
export class AssessmentDetailPage {
    instrument: any;
    assessment: any;

    constructor(private nav: NavController, private navParams: NavParams, assessmentData: AssessmentProvider, instrumentData: InstrumentProvider) {
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(assessment => {
            console.log(assessment);
            this.assessment = assessment;
            instrumentData.getSingle(this.assessment.instrument.id).then(instrument => {
                console.log(assessment);
                this.instrument = instrument;
            });
        });
    }

    goToAssessment(assessment) {
        alert(assessment.instrument.name);
    }
}
