import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {MemberDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";

@Component({
    templateUrl: 'build/pages/member/list.html'
})
export class MemberListPage {
    members = [];

    constructor(private nav: NavController, memberData: MemberProvider) {
        var organizationId = 2;
        var drilldown = 1;
        var includeInactive = 0;
        var args = [organizationId, drilldown, includeInactive];
        memberData.getAll(DataModel.buildArgs(args)).then(members => {
            this.members = members;
        });
    }

    goToDetail(member) {
        this.nav.push(MemberDetailPage, member);
    }

}
