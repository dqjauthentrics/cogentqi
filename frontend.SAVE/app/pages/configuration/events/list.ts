import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {EventConfigPage} from "./config";

@Component({
    templateUrl: 'build/pages/configuration/events/list.html'
})
export class CfgEventsListPage {
    events = [];

    constructor(private nav: NavController, eventData: EventProvider) {
        eventData.getAll(null).then(events => {
            this.events = events;
        });
    }

    configureEvent(event) {
        this.nav.push(EventConfigPage, event);
    }
}


