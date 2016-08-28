import {Component} from "@angular/core";
import {DomSanitizationService} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ScheduleProvider} from "../../../providers/schedule";

@Component({
    templateUrl: 'build/pages/configuration/schedule/config.html',
})
export class ScheduleConfigPage {
    schedule: any;

    constructor(private nav: NavController, private navParams: NavParams, scheduleData: ScheduleProvider, http: Http, private sanitizer: DomSanitizationService) {
        this.schedule = this.navParams.data;
        scheduleData.getSingle(this.schedule.id).then(schedule => {
            this.schedule = schedule;
        });
    }
}