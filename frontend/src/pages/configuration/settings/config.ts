import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../../providers/config";
import {SessionProvider} from "../../../providers/session";

@Component({
    templateUrl: 'config.html',
})
export class SettingsConfigPage {
    data: any = {weight: 3, threshold: 3};

    constructor(private nav: NavController, private navParams: NavParams, config: Config, sessionData: SessionProvider) {
        //let user = sessionData.user;
        this.data.setting = 4;
    }
}