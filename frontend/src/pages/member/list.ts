import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {MemberDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";

@Component({
    templateUrl: 'list.html'
})
export class MemberListPage {
    public loading: boolean = false;
    public members = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, memberData: MemberProvider) {
        this.loading = true;
        let organizationId = 2;
        let drilldown = 1;
        let includeInactive = 0;
        let args = [organizationId, drilldown, includeInactive];
        memberData.getAll(DataModel.buildArgs(args), false).then(members => {
            this.members = members;
            for (let member of this.members) {
                member.visible = true;
            }
            this.loading = false;
        });
    }

    goToDetail(member) {
        this.nav.push(MemberDetailPage, member);
    }

    sortName(member: any) {
        return member.lastName + ', ' + member.firstName + ' ' + member.middleName;
    }

    sortLastAssessment(member: any) {
        return member.lastAssessment ? member.lastAssessment.lastModified : null;
    }

    sortBadges(member: any) {
        return member.badges.length;
    }
}
