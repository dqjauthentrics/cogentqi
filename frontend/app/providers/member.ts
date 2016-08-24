import {Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Config} from "./config";

@Injectable()
export class MemberProvider extends DataModel {

    constructor(protected http: Http, config: Config, protected events: Events) {
        super('member', http, config, events);
    }

}
