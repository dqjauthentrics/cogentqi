import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {SessionProvider} from "../../providers/session";
import {DashboardPage} from "../dashboard/dashboard";
import {ResourceListPage} from "../resource/list";
import {MemberListPage} from "../member/list";
import {AssessmentListPage} from "../assessment/list";
import {OrganizationListPage} from "../organization/list";
import {CfgScheduleListPage} from "../configuration/schedule/list";
import {CfgResourcesListPage} from "../configuration/resources/list";
import {CfgInstrumentsListPage} from "../configuration/instruments/list";
import {CfgEventsListPage} from "../configuration/events/list";
import {CfgOutcomesListPage} from "../configuration/outcomes/list";
import {SettingsConfigPage} from "../configuration/settings/config";
import {ConfigurationPage} from "../configuration/configuration";
import {ReportsPage} from "../report/index";

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
        {title: 'Members', page: MemberListPage, icon: 'members', show: this.session.user.nMembers > 1},
        {title: 'Assessments', page: AssessmentListPage, icon: 'assessments', show: this.session.user.nMembers > 1},
        {title: 'Organizations', page: OrganizationListPage, icon: 'organizations', show: this.session.user.nChildOrgs > 0},
        {title: 'Resources', page: ResourceListPage, icon: 'resources', show: true},
        {title: 'Reports', page: ReportsPage, icon: 'trending-up', show: true},
        {title: 'Configuration', page: ConfigurationPage, icon: 'configuration', show: true},
    ];
    cfgPages: TabPageObj[] = [
        {title: 'Dashboard', page: DashboardPage, icon: 'dashboard', show: true},
        {title: 'Schedule', page: CfgScheduleListPage, icon: 'schedule', show: true},
        {title: 'Resources', page: CfgResourcesListPage, icon: 'resources', show: true},
        {title: 'Events', page: CfgEventsListPage, icon: 'events', show: true},
        {title: 'Outcomes', page: CfgOutcomesListPage, icon: 'outcomes', show: true},
        {title: 'Instruments', page: CfgInstrumentsListPage, icon: 'instruments', show: true},
        {title: 'Settings', page: SettingsConfigPage, icon: 'settings', show: true},
    ];

    selectedIndex: number;

    /**
     */
    constructor(private navParams: NavParams, private nav: NavController, private globals: Globals, private session: SessionProvider) {
        let pageSet = globals.tabMode == 'normal' ? this.mainPages : this.cfgPages;
        for (let i = 0; i < pageSet.length; i++) {
            if (!pageSet[i].show) {
                pageSet.splice(i, 1);
                i--;
            }
        }
        this.pages = pageSet;
        this.selectedIndex = navParams.data.tabIndex || 0;
    }

    /**
     * Called on (ionselect), switches back to main dashboard tabs from configuration.
     * @returns {boolean}
     */
    tabSelected(index, page) {
        if (index == 0 && this.globals.tabMode != 'normal') {
            this.globals.tabMode = 'normal';
            this.nav.setRoot(TabsPage);
        }
        return true;
    }

}
