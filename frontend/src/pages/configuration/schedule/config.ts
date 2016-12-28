import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ScheduleProvider} from "../../../providers/schedule";

@Component({
    templateUrl: 'config.html',
})
export class ConfigSchedulesPage {
    schedule: any;

    constructor(private nav: NavController, private navParams: NavParams, scheduleData: ScheduleProvider, http: Http) {
        let comp = this;
        this.schedule = this.navParams.data;
        scheduleData.getSingle(this.schedule.id).then(schedule => {
            comp.schedule = schedule;
        });
    }
}