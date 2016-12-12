import {Injectable} from "@angular/core";
import {Events, AlertController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";

@Injectable()
export class MemberProvider extends DataModel {

    constructor(protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('member', alertCtrl, http, globals, config);
    }

}
