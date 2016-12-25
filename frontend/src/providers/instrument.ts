import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class InstrumentProvider extends DataModel {
    public SECTION_ALL = -100;
    public SECTION_SUMMARY = -101;
    public list = null;
    public current = null;
    public currentSectionIdx = this.SECTION_ALL;

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('instrument', toastCtrl, http, globals, config, session);
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
