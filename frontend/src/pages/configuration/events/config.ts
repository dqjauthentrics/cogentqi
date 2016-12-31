import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {EventProvider} from "../../../providers/event";
import {Globals} from "../../../providers/globals";

declare let Quill: any;

@Component({
    templateUrl: 'config.html',
})
export class ConfigEventsPage {
    public event: any;
    public evtDescripEditor: any;

    constructor(private nav: NavController, private globals: Globals, private navParams: NavParams, eventData: EventProvider, http: Http) {
        this.event = this.navParams.data;
        eventData.getSingle(this.event.id).then(event => {
            this.event = event;
            if (this.event) {
                this.event.valid = true;
            }
        });
    }

    ngAfterViewInit() {
        this.evtDescripEditor = new Quill('#evtDescripEditor', {
            theme: 'snow'
        });
    }

    save(resource) {
        this.globals.alertWarning('TODO: Save Event');
    }

    remove(resource) {
        let comp = this;
        this.globals.confirm('Are you sure you wish to remove this event permanently?', function () {
            comp.globals.alertWarning('TODO: Remove Event');
        });
    }
}