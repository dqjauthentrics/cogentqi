import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class OutcomeProvider extends DataModel {
    public readonly METHOD_DATA = 'D';
    public readonly METHOD_MANUAL = 'M';

    constructor(protected toastCtrl: ToastController, protected http: Http, public globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('outcome', toastCtrl, http, globals, config, session);
    }

    init() {
        return this.getAll(null, false).then((outcomes) => {
            if (outcomes) {
                this.globals.outcomes = outcomes;
            }
        });
    }

    getTrends(organizationId) {
        return this.getData('/trends/' + organizationId);
    }

    averageLevel() {
        let avgOutcomeLevel = 0;
        let total = 0.0;
        let nOutcomes = 0;
        if (this.globals.outcomes) {
            for (let outcome of this.globals.outcomes) {
                total += outcome.level;
                nOutcomes++;
            }
        }
        if (nOutcomes > 0 && total > 0) {
            avgOutcomeLevel = Math.round((total / nOutcomes) * 100);
        }
        return avgOutcomeLevel;
    }
}
