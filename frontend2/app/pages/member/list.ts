import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberData} from "../../providers/member";
import {MemberDetailPage} from "./detail";

@Component({
    templateUrl: 'build/pages/member/list.html'
})
export class MemberListPage {
    members = [];

    constructor(private nav: NavController, memberData: MemberData) {
        console.log('member constructor');
        memberData.getMembers().then(members => {
            console.log(members);
            this.members = members;
        });
    }

    goToDetail(member) {
        console.log(member);
        this.nav.push(MemberDetailPage, member);
    }

}
