import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ScheduleProvider} from "../../../providers/schedule";
import {ScheduleConfigPage} from "./config";

@Component({
    templateUrl: 'build/pages/configuration/schedule/list.html'
})
export class CfgScheduleListPage {
    schedule = [];

    constructor(private nav: NavController, scheduleData: ScheduleProvider) {
        scheduleData.getAll(null).then(schedule => {
            this.schedule = schedule;
        });
    }

    configureSchedule(schedule) {
        this.nav.push(ScheduleConfigPage, schedule);
    }
}


