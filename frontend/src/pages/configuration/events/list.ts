import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {EventConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgEventsListPage {
    events = [];
    queryText: string;

    constructor(private nav: NavController, eventData: EventProvider) {
        eventData.getAll(null, false).then(events => {
            this.events = events;
        });
    }

    configureEvent(event) {
        this.nav.push(EventConfigPage, event);
    }
}


