import {Component} from "@angular/core";
import {DomSanitizationService} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {EventProvider} from "../../../providers/event";

@Component({
    templateUrl: 'build/pages/configuration/events/config.html',
})
export class EventConfigPage {
    event: any;

    constructor(private nav: NavController, private navParams: NavParams, eventData: EventProvider, http: Http, private sanitizer: DomSanitizationService) {
        this.event = this.navParams.data;
        eventData.getSingle(this.event.id).then(event => {
            this.event = event;
        });
    }
}