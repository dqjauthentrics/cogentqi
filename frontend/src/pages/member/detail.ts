import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberProvider} from "../../providers/member";

@Component({
    templateUrl: 'detail.html'
})
export class MemberDetailPage {
    member: any;

    constructor(private nav: NavController, private navParams: NavParams, memberData: MemberProvider) {
        this.member = this.navParams.data;
        memberData.getSingle(this.member.id).then(member => {
            this.member = member;
        });
    }

    goToAssessment(assessment) {
        alert(assessment.instrument.name);
    }
}
