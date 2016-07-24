import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./DataModel";

@Injectable()
export class ResourceData extends DataModel {
    data: any;

    constructor(http: Http) {
        super('resource', http);
    }

}
