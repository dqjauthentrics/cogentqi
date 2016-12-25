import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../providers/config";
import {SessionProvider} from "../../providers/session";
import {ScheduleConfigPage} from "./schedule/config";
import {CfgScheduleListPage} from "./schedule/list";
import {CfgResourcesListPage} from "./resources/list";
import {CfgEventsListPage} from "./events/list";
import {CfgOutcomesListPage} from "./outcomes/list";
import {CfgInstrumentsListPage} from "./instruments/list";

export interface MenuItem {
    page: any;
    icon: string;
    name: string;
    description: string;
}

@Component({
    templateUrl: 'configuration.html',
})
export class ConfigurationPage {
    public menuItems: MenuItem[] = [
        {
            page: CfgScheduleListPage,
            icon: 'schedule',
            name: 'Assessment Schedule',
            description: 'Review the schedule of assessments to be used within your organization.'
        },
        {
            page: CfgResourcesListPage,
            icon: 'resources',
            name: 'Learning Resources',
            description: 'Set up the educational resources available for your organization, along with their alignments to competencies.'
        },
        {
            page: CfgEventsListPage,
            icon: 'event',
            name: 'Events',
            description: 'Review all events that can occur in your organization, along with their alignments to competencies.'
        },
        {
            page: CfgOutcomesListPage,
            icon: 'outcome',
            name: 'Outcomes',
            description: 'Review the set of general outcomes tracked by your organization, along with their alignments to competencies.'
        },
        {
            page: CfgInstrumentsListPage,
            icon: 'instrument',
            name: 'Competency Instruments',
            description: 'Define the set(s) of competencies recognized by your organization for use in assessments.'
        },
        {
            page: ScheduleConfigPage,
            icon: 'weights',
            name: 'Top-Level Weights',
            description: 'Provide relative weights for system components used in algorithmic determinations.'
        },
        {
            page: ScheduleConfigPage,
            icon: 'settings',
            name: 'Personal Settings',
            description: 'Review personal settings.'
        }
    ];

    constructor(private nav: NavController, private navParams: NavParams, config: Config, session: SessionProvider) {
    }

    goToPage(item) {
        this.nav.push(item.page);
    }
}