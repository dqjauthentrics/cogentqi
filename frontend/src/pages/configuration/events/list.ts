import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {EventConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgEventsListPage {
    public events = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, eventData: EventProvider) {
        this.loading = true;
        eventData.getAll(null, false).then(events => {
            this.events = events;
            this.loading = false;
        });
    }

    configureEvent(event) {
        this.nav.push(EventConfigPage, event);
    }
}


