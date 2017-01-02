import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {SessionProvider} from "../../providers/session";
import {DashboardPage} from "../dashboard/dashboard";
import {ResourceListPage} from "../resource/list";
import {MemberListPage} from "../member/list";
import {AssessmentListPage} from "../assessment/list";
import {OrganizationListPage} from "../organization/list";
import {ConfigurationPage} from "../configuration/index";
import {ReportsPage} from "../report/index";
import {ProfessionalPage} from "../professional/index";

export interface TabPageObj {
    title: string;
    page: any;
    icon: string;
    show: boolean;
}

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
    pages: TabPageObj[] = [];

    mainPages: TabPageObj[] = [
        {title: 'Dashboard', page: DashboardPage, icon: 'dashboard', show: true},
        {title: 'Members', page: MemberListPage, icon: 'members', show: this.nMembers() > 1},
        {title: 'Assessments', page: AssessmentListPage, icon: 'assessments', show: this.nMembers() > 1},
        {title: 'Organizations', page: OrganizationListPage, icon: 'organizations', show: this.nChildOrgs() > 0},
        {title: 'Resources', page: ResourceListPage, icon: 'resources', show: true},
        {title: 'Reports', page: ReportsPage, icon: 'trending-up', show: true},
        {title: 'Configuration', page: ConfigurationPage, icon: 'configuration', show: true},
    ];
    profPages: TabPageObj[] = [
        {title: 'Professional', page: ProfessionalPage, icon: 'home', show: true},
        {title: 'Resources', page: ResourceListPage, icon: 'resources', show: true},
    ];

    selectedIndex: number;

    /**
     */
    constructor(private navParams: NavParams, private nav: NavController, private globals: Globals, private session: SessionProvider) {
        let pageSet = this.session.user && this.globals.appRoleId(this.session.user.roleId) !== this.globals.APP_ROLE_PROFESSIONAL ? this.mainPages : this.profPages;
        for (let i = 0; i < pageSet.length; i++) {
            if (!pageSet[i].show) {
                pageSet.splice(i, 1);
                i--;
            }
        }
        this.pages = pageSet;
        this.selectedIndex = navParams.data.tabIndex || 0;
    }

    nMembers() {
        return this.session.user ? this.session.user.nMembers : 0;
    }

    nChildOrgs() {
        return this.session.user ? this.session.user.nChildOrgs : 0;
    }

}
