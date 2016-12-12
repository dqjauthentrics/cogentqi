import {Injectable} from "@angular/core";
import {Events, AlertController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";

@Injectable()
export class ResourceProvider extends DataModel {
    public content: string = '';

    constructor(protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('resource', alertCtrl, http, globals, config);
    }

}
