import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class PlanItemProvider extends DataModel {
    public readonly STATUS_RECOMMENDED = 'R';
    public readonly STATUS_ENROLLED = 'E';
    public readonly STATUS_WITHDRAWN = 'W';
    public readonly STATUS_COMPLETED = 'C';

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('plan-item', toastCtrl, http, globals, config, session);
    }

    retrieveYear(organizationId, status) {
        return this.getData('/year/' + organizationId + '/' + status);
    }

    forMember(organizationId, memberId) {
        return this.getData('/list/' + organizationId + '/' + memberId);
    }

    forOrganization(organizationId) {
        return this.getData('/list/' + organizationId);
    }

}
