import {Injectable} from "@angular/core";
import {Events, ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";

@Injectable()
export class ScheduleProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('schedule', toastCtrl, http, globals, config);
    }
}
