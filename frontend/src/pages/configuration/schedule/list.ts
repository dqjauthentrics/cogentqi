import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ScheduleProvider} from "../../../providers/schedule";
import {ConfigSchedulesPage} from "./config";
import {IconProvider} from "../../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class ConfigScheduleListPage {
    schedule = [];
    queryText: string;

    constructor(private nav: NavController, scheduleData: ScheduleProvider, public icon: IconProvider) {
        let comp = this;
        scheduleData.getAll(null, false).then(schedule => {
            comp.schedule = schedule;
        });
    }

    configureSchedule(schedule) {
        this.nav.push(ConfigSchedulesPage, schedule);
    }
}


