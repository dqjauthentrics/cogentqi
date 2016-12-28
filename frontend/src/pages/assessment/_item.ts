import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentDetailPage} from "./detail";

@Component({
    selector: 'assessment-item',
    templateUrl: '_item.html'
})

export class AssessmentItem {
    @Input() assessment: any;
    @Input() showMember: boolean = true;
    @Input() showIcon: boolean = true;

    constructor(private nav: NavController) {
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }
}