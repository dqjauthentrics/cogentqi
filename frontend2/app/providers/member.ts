import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {DataModel} from "./DataModel";

@Injectable()
export class MemberData extends DataModel {

    constructor(http: Http) {
        super('member', http);
    }

}
