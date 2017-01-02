import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {SessionProvider} from "../../providers/session";
import {MemberDetailPage} from "./detail";
import {IconProvider} from "../../providers/icon";
import {Globals} from "../../providers/globals";

@Component({
    selector: 'member-list',
    templateUrl: '_list.html'
})
export class MemberList {
    @Input() organizationId: number;
    @Input() rowsOnPage: number = 5;
    @Input() includeLastAssessment: boolean = true;

    public members: Array<any>;
    public filterQuery = "";
    public sortBy = "orderedOn";
    public sortOrder = "desc";
    public loading: boolean;

    constructor(private nav: NavController, public session: SessionProvider, public globals: Globals, public memberProvider: MemberProvider, public icon: IconProvider) {
        this.loading = true;
    }

    ngOnInit() {
        let comp = this;
        if (comp.organizationId) {
            comp.memberProvider.getAll('/' + comp.organizationId + '/1/1', true).then((members: any) => {
                comp.members = members;
                comp.loading = false;
            });
        }
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
