import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberData} from "../../providers/member-data";

@Component({
    templateUrl: 'build/pages/member/detail.html'
})
export class MemberDetailPage {
    member: any;

    constructor(private nav: NavController, private navParams: NavParams, memberData: MemberData) {
        this.member = this.navParams.data;
        memberData.getProfile(this.member.id).then(member => {
            this.member = member;
        });
        console.log('member detail constructor', this.member);
    }

    goToAssessment(assessment) {
        alert(assessment.instrument.name);
    }
}
