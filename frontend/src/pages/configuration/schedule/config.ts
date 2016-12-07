import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ScheduleProvider} from "../../../providers/schedule";

@Component({
    templateUrl: 'config.html',
})
export class ScheduleConfigPage {
    schedule: any;

    constructor(private nav: NavController, private navParams: NavParams, scheduleData: ScheduleProvider, http: Http) {
        this.schedule = this.navParams.data;
        scheduleData.getSingle(this.schedule.id).then(schedule => {
            this.schedule = schedule;
        });
    }
}