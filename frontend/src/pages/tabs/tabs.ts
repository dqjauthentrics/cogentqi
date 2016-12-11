import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {DashboardPage} from "../dashboard/dashboard";
import {HelpPage} from "../help/help";
import {ResourceListPage} from "../resource/list";
import {MemberListPage} from "../member/list";
import {ConfigHelpIndex} from "../configuration/help/index";
import {CfgScheduleListPage} from "../configuration/schedule/list";
import {CfgResourcesListPage} from "../configuration/resources/list";
import {CfgInstrumentsListPage} from "../configuration/instruments/list";
import {CfgEventsListPage} from "../configuration/events/list";
import {CfgOutcomesListPage} from "../configuration/outcomes/list";
import {SettingsConfigPage} from "../configuration/settings/config";
import {ConfigurationPage} from "../configuration/configuration";

export interface TabPageObj {
    title: string;
    page: any;
    icon: string;
}

@Component({
    templateUrl: 'tabs.html'
})

export class TabsPage {
    pages: TabPageObj[] = [];

    mainPages: TabPageObj[] = [
        {title: 'Dashboard', page: DashboardPage, icon: 'dashboard'},
        {title: 'Members', page: MemberListPage, icon: 'members'},
        {title: 'Resources', page: ResourceListPage, icon: 'resources'},
        {title: 'Configuration', page: ConfigurationPage, icon: 'configuration'},
        {title: 'Help', page: HelpPage, icon: 'help'}
    ];
    cfgPages: TabPageObj[] = [
        {title: 'Dashboard', page: DashboardPage, icon: 'dashboard'},
        {title: 'Schedule', page: CfgScheduleListPage, icon: 'schedule'},
        {title: 'Resources', page: CfgResourcesListPage, icon: 'resources'},
        {title: 'Events', page: CfgEventsListPage, icon: 'events'},
        {title: 'Outcomes', page: CfgOutcomesListPage, icon: 'outcomes'},
        {title: 'Instruments', page: CfgInstrumentsListPage, icon: 'instruments'},
        {title: 'Settings', page: SettingsConfigPage, icon: 'settings'},
        {title: 'Help', page: ConfigHelpIndex, icon: 'help'}
    ];

    selectedIndex: number;

    /**
     * TabsPage constructor.
     * @param navParams
     * @param nav
     * @param globals
     */
    constructor(private navParams: NavParams, private nav: NavController, private globals: Globals) {
        this.pages = globals.tabMode == 'normal' ? this.mainPages : this.cfgPages;
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
