import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class AssessmentProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('assessment', toastCtrl, http, globals, config, session);
    }

    loadMatrix(organizationId: number, instrumentId: number) {
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/matrix/' + organizationId + '/' + instrumentId).subscribe(res => {
                let jsonResponse = res.json();
                this.list = jsonResponse.data;
                resolve(this.list);
            });
        });
    }

    retrieveProgressByMonth(instrumentId, isRollUp) {
        if (instrumentId && this.session.user) {
            return this.getData('/organizationProgressByMonth/' + this.session.user.organizationId + '/' + instrumentId);
        }
        return null;
    };

    retrieveIndividualProgressByMonth(memberId) {
        if (memberId) {
            return this.getData('/memberProgressByMonth/' + memberId,);
        }
        return null;
    };

    retrieveByMember(memberId, lastN) {
        if (memberId) {
            return this.getData('/byMember/' + memberId);
        }
        return null;
    };

    retrieveYear(organizationId) {
        return this.getData('/year/' + organizationId);
    }
    retrieveYearAverage(organizationId) {
        return this.getData('/yearAverage/' + organizationId);
    }
}
