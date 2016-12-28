import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {AssessmentDetailPage} from "../assessment/detail";
import {MemberProgressPage} from "./progress";
import {MemberCompetencyHistoryPage} from "./competency-history";
import {MemberNotesPage} from "./notes";

@Component({
    templateUrl: 'detail.html'
})
export class MemberDetailPage {
    public member: any;

    constructor(private nav: NavController, private navParams: NavParams, memberData: MemberProvider) {
        this.member = this.navParams.data;
        console.log('member entry:', this.member);
        if (this.member) {
            memberData.getSingle(this.member.id).then(member => {
                this.member = member;
                console.log('member', member);
            });
        }
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

    goToProgress(member) {
        this.nav.push(MemberProgressPage, member);
    }

    goToCompetencyHistory(member) {
        this.nav.push(MemberCompetencyHistoryPage, member);
    }

    goToNotes(member) {
        this.nav.push(MemberNotesPage, member);
    }
}
