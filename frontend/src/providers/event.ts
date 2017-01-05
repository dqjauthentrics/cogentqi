import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class EventProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('event', toastCtrl, http, globals, config, session);

        this.getAll(null, false).then((appEvents) => {
            try {
                if (appEvents) {
                    this.globals.appEvents = appEvents;
                }
            }
            catch (exception) {
                console.error("COGIC ERROR:", exception);
            }
        });
    }
}
