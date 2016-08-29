import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {GlobalsProvider} from "../../providers/globals";
import {DashboardPage} from "../dashboard/dashboard";
import {helpPage} from "../help/help";
import {AssessmentListPage} from "../assessment/list";
import {ResourceListPage} from "../resource/list";
import {MemberListPage} from "../member/list";
import {ConfigHelpIndex} from "../configuration/help/index";
import {ConfigureScheduleListPage} from "../configuration/schedule/list";
import {ConfigureResourcesListPage} from "../configuration/resources/list";
import {ConfigureInstrumentsListPage} from "../configuration/instruments/list";
import {ConfigureEventsListPage} from "../configuration/events/list";
import {ConfigureOutcomesListPage} from "../configuration/outcomes/list";
import {SettingsConfigPage} from "../configuration/settings/config";

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    mainDashboardRoot: any = DashboardPage;
    mainMemberRoot: any = MemberListPage;
    mainResourceRoot: any = ResourceListPage;
    mainAssessmentRoot: any = AssessmentListPage;
    mainHelpRoot: any = helpPage;

    cfgDashboardRoot: any = DashboardPage;
    cfgScheduleRoot: any = ConfigureScheduleListPage;
    cfgResourcesRoot: any = ConfigureResourcesListPage;
    cfgEventsRoot: any = ConfigureEventsListPage;
    cfgOutcomesRoot: any = ConfigureOutcomesListPage;
    cfgInstrumentsRoot: any = ConfigureInstrumentsListPage;
    cfgSettingsRoot: any = SettingsConfigPage;
    cfgHelpRoot: any = ConfigHelpIndex;

    selectedIndex: number;

    constructor(private navParams: NavParams, private nav: NavController, private globals: GlobalsProvider) {
        this.selectedIndex = navParams.data.tabIndex || 0;
        if (navParams.data.tabMode) {
            globals.tabMode = navParams.data.tabMode;
        }
        console.log('TABS:', this);
    }

    goHome() {
        this.globals.tabMode = 'normal';
        this.nav.setRoot(TabsPage);
        return true;
    }

}
