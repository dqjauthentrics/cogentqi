import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {SessionProvider} from "../../providers/session";
import {AssessmentDetailPage} from "./detail";
import {IconProvider} from "../../providers/icon";

@Component({
    selector: 'organization-assessments',
    templateUrl: '_organization-assessments.html',
})

export class OrganizationAssessments {
    @Input() organizationId: number;

    public loading: boolean = false;
    public assessments = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, private assessmentData: AssessmentProvider, public session: SessionProvider, public icon: IconProvider) {
    }

    ngOnInit() {
        let comp = this;
        if (this.organizationId) {
            this.loading = true;
            this.assessmentData.getAll('/' + this.organizationId, true).then(assessments => {
                comp.assessments = assessments;
                comp.loading = false;
            });
        }
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

}
