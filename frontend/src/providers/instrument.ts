import {Injectable} from "@angular/core";
import {Events, AlertController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";

@Injectable()
export class InstrumentProvider extends DataModel {
    public SECTION_ALL = -100;
    public SECTION_SUMMARY = -101;
    public list = null;
    public current = null;
    public currentSectionIdx = this.SECTION_ALL;

    constructor(protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('member', alertCtrl, http, globals, config);
    }

    find(id: number) {
        if (this.list) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].id == id) {
                    this.current = this.list[i];
                    return this.list[i];
                }
            }
        }
        return null;
    }
}
