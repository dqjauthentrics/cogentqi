import {Injectable} from "@angular/core";
import {Events, ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";

@Injectable()
export class AssessmentProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events) {
        super('assessment', toastCtrl, http, globals, config);
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

}
