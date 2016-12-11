import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../providers/config";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'configuration.html',
})
export class ConfigurationPage {
    menuItems = [];

    constructor(private nav: NavController, private navParams: NavParams, config: Config, session: SessionProvider) {
        this.menuItems = [
            {
                url: '#/administrator/schedule',
                icon: 'schedule',
                name: 'Step 6. Assessment Schedule',
                description: 'Review the schedule of assessments to be used within your organization.'
            },
            {
                url: '#/resource/configure',
                icon: 'resource',
                name: 'Step 5. Learning Resources',
                description: 'Set up the educational resources available for your organization, along with their alignments to competencies.'
            },
            {
                url: '#/event/configList',
                icon: 'event',
                name: 'Step 4. Events',
                description: 'Review all events that can occur in your organization, along with their alignments to competencies.'
            },
            {
                url: '#/outcome/configList',
                icon: 'outcome',
                name: 'Step 3. Outcomes',
                description: 'Review the set of general outcomes tracked by your organization, along with their alignments to competencies.'
            },
            {
                url: '#/instrument/list',
                icon: 'instrument',
                name: 'Step 2. Competency Instruments',
                description: 'Define the set(s) of competencies recognized by your organization for use in assessments.'
            },
            {
                url: '#/administrator/weights',
                icon: 'weights',
                name: 'Step 1. Top-Level Weights',
                description: 'Provide relative weights for system components used in algorithmic determinations.'
            },
            {
                url: '#/settings/personal',
                icon: 'settings',
                name: 'Step 0. Settings',
                description: 'Review personal settings.'
            }
        ];
    }

    goToPage(item) {
        console.log('go', item);
    }
}