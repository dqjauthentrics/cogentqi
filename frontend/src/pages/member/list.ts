import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {SessionProvider} from "../../providers/session";
import {MemberDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";
import {IconProvider} from "../../providers/icon";
import {Config} from "../../providers/config";

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

    constructor(private nav: NavController, private session: SessionProvider, public config: Config, public memberData: MemberProvider, public icon: IconProvider) {
        this.loading = true;
        let organizationId = this.session.user.organizationId;
        let drilldown = 1;
        let includeInactive = 0;
        let args = [organizationId, drilldown, includeInactive];
        memberData.getAll(DataModel.buildArgs(args), false).then(members => {
            this.members = members;
            for (let member of this.members) {
                member.visible = true;
            }
            this.loading = false;
            console.log('member constructor loaded', this.members);
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
