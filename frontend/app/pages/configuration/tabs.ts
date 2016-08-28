import {Component, ViewChild} from "@angular/core";
import {Nav, NavParams} from "ionic-angular";
import {DashboardPage} from "../dashboard/dashboard";
import {ConfigHelpIndex} from "./help/index";
import {ConfigureScheduleListPage} from "./schedule/list";
import {ConfigureResourcesListPage} from "./resources/list";
import {ConfigureInstrumentsListPage} from "./instruments/list";
import {ConfigureEventsListPage} from "./events/list";
import {ConfigureOutcomesListPage} from "./outcomes/list";
import {SettingsConfigPage} from "./settings/config";

@Component({
    templateUrl: 'build/pages/configuration/tabs.html'
})

export class ConfigTabsPage {
// The root nav is a child of the root app component.  @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    cfgDashboardRoot: any = DashboardPage;
    cfgScheduleRoot: any = ConfigureScheduleListPage;
    cfgResourcesRoot: any = ConfigureResourcesListPage;
    cfgEventsRoot: any = ConfigureEventsListPage;
    cfgOutcomesRoot: any = ConfigureOutcomesListPage;
    cfgInstrumentsRoot: any = ConfigureInstrumentsListPage;
    cfgSettingsRoot: any = SettingsConfigPage;
    cfgHelpRoot: any = ConfigHelpIndex;

    selectedIndex: number;

    constructor(navParams: NavParams) {
        this.selectedIndex = navParams.data.tabIndex || 0;
    }
}
