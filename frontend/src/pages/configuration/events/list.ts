import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {Globals} from "../../../providers/globals";
import {ConfigEventsPage} from "./config";
import {IconProvider} from "../../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class ConfigEventsListPage {
    public events = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, private globals: Globals, private eventData: EventProvider, public icon: IconProvider) {
        this.events = this.globals.appEventsAsArray();
    }

    configureEvent(event) {
        this.nav.push(ConfigEventsPage, event);
    }
}


