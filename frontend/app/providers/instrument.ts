import {Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Config} from "./config";

@Injectable()
export class InstrumentProvider extends DataModel {
    public SECTION_ALL = -100;
    public SECTION_SUMMARY = -101;
    public list = null;
    public current = null;
    public currentSectionIdx = this.SECTION_ALL;

    constructor(protected http: Http, config: Config, protected events: Events) {
        super('instrument', http, config, events);
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
