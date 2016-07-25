import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./DataModel";
import {Config} from "./config";

@Injectable()
export class MemberData extends DataModel {

    constructor(http: Http, config: Config) {
        super('member', http, config);
    }

}
