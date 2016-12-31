import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class OutcomeProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('outcome', toastCtrl, http, globals, config, session);
    }

    getTrends(organizationId) {
        return this.getData('/trends/' + organizationId);
    }

    byOrganization(organizationId) {
        return this.getData('/byOrganization/' + organizationId + '/1');
    }

}
