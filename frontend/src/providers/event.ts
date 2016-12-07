import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Config} from "./config";

@Injectable()
export class EventProvider extends DataModel {

    constructor(protected http: Http, config: Config) {
        super('event', http, config);
    }

}
