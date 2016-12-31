import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class ResourceProvider extends DataModel {
    public content: string = '';

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('resource', toastCtrl, http, globals, config, session);
    }

    getContent(resource) {
        return this.getData('/content/' + this.config.siteDir + '/' + resource.number);
    }
}
