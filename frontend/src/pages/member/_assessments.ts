import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentDetailPage} from "../assessment/detail";

@Component({
    selector: 'member-assessments-card',
    templateUrl: '_assessments.html'
})

export class MemberAssessmentsCard {
    @Input() assessments: any[];

    public filterQuery = "";
    public rowsOnPage = 3;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController) {
    }

    sortName(event: any) {
        return event.name;
    }

    sortCategory(event: any) {
        return event.category;
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }
}
