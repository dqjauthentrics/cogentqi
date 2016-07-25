import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./DataModel";
import {Config} from "./config";

@Injectable()
export class ResourceData extends DataModel {
    data: any;

    constructor(http: Http, config: Config) {
        super('resource', http, config);
    }

}
