import {Component} from "@angular/core";
import {ConfigScheduleListPage} from "./schedule/list";
import {ConfigResourcesListPage} from "./resources/list";
import {ConfigEventsListPage} from "./events/list";
import {ConfigOutcomesListPage} from "./outcomes/list";
import {ConfigInstrumentsListPage} from "./instruments/list";
import {ConfigSettingsPage} from "./settings/config";
import {PageMenuItem} from "../../components/page-menu";

@Component({
    templateUrl: 'index.html',
})
export class ConfigurationPage {
    public items: PageMenuItem[] = [
        {
            page: ConfigScheduleListPage,
            icon: 'schedule',
            name: 'Assessment Schedule',
            description: 'Review the schedule of assessments to be used within your organization.'
        },
        {
            page: ConfigResourcesListPage,
            icon: 'resources',
            name: 'Learning Resources',
            description: 'Set up the educational resources available for your organization, along with their alignments to competencies.'
        },
        {
            page: ConfigEventsListPage,
            icon: 'event',
            name: 'Events',
            description: 'Review all events that can occur in your organization, along with their alignments to competencies.'
        },
        {
            page: ConfigOutcomesListPage,
            icon: 'outcome',
            name: 'Outcomes',
            description: 'Review the set of general outcomes tracked by your organization, along with their alignments to competencies.'
        },
        {
            page: ConfigInstrumentsListPage,
            icon: 'instrument',
            name: 'Competency Instruments',
            description: 'Define the set(s) of competencies recognized by your organization for use in assessments.'
        },
        {
            page: ConfigSettingsPage,
            icon: 'weights',
            name: 'Top-Level Weights',
            description: 'Provide relative weights for system components used in algorithmic determinations.'
        }
    ];
}