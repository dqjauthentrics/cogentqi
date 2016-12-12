import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {AssessmentDetailPage} from "../assessment/detail";

@Component({
    templateUrl: 'detail.html'
})
export class MemberDetailPage {
    public member: any;

    constructor(private nav: NavController, private navParams: NavParams, memberData: MemberProvider) {
        this.member = this.navParams.data;
        memberData.getSingle(this.member.id).then(member => {
            this.member = member;
            console.log('member', member);
        });
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, {assessment: assessment});
    }
}
