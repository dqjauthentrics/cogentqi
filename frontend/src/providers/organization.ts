import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Config} from "./config";
import {ToastController} from "ionic-angular";

@Injectable()
export class OrganizationProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected config: Config) {
        super('organization', http, config);
    }

}
