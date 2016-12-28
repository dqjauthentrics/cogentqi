import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {ConfigEventsPage} from "./config";
import {IconProvider} from "../../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class ConfigEventsListPage {
    public events = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, eventData: EventProvider, public icon: IconProvider) {
        this.loading = true;
        eventData.getAll(null, false).then(events => {
            this.events = events;
            this.loading = false;
        });
    }

    configureEvent(event) {
        this.nav.push(ConfigEventsPage, event);
    }
}


