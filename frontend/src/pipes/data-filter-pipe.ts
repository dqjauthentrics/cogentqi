import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";
import {Config} from "../providers/config";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

    constructor(private config: Config) {
    }

    match(query, val) {
        if (val) {
            if (typeof val !== 'string') {
                val = val.toString();
            }
            return _.lowerCase(val).indexOf(query) > -1;
        }
        return false;
    }

    matchMember(query, rec) {
        let match = false;
        if (rec) {
            if (rec.lastName) {
                match = match || this.match(query, rec.lastName + ', ' + rec.firstName + ' ' + rec.middleName);
                if (!match) {
                    match = match || this.match(query, rec.firstName + ' ' + rec.middleName + ' ' + rec.lastName);
                }
            }
            if (!match && rec.email) {
                match = match || this.match(query, rec.email);
            }
            if (!match && rec.roleId) {
                match = match || this.match(query, this.config.roleName(rec.roleId));
            }
        }
        return match;
    }

    matchResource(query, rec) {
        let match = false;
        if (rec) {
            if (rec.name) {
                match = match || this.match(query, rec.name);
            }
            if (rec.number) {
                match = match || this.match(query, rec.number);
            }
            if (!match && rec.summary) {
                match = match || this.match(query, rec.summary);
            }
            if (!match && rec.description) {
                match = match || this.match(query, rec.description);
            }
        }
        return match;
    }

    matchOrganization(query, rec) {
        let match = false;
        if (rec) {
            match = this.match(query, rec.name);
            if (!match && rec.code) {
                match = this.match(query, rec.code);
            }
            if (!match && rec.address) {
                match = this.match(query, rec.address);
            }
            if (!match && rec.city) {
                match = this.match(query, rec.city);
            }
            if (!match && rec.state) {
                match = this.match(query, rec.state);
            }
            if (!match && rec.postal) {
                match = this.match(query, rec.postal);
            }
        }
        return match;
    }

    matchAssessment(query, rec) {
        let match = false;
        if (rec) {
            if (rec.instrument) {
                match = this.match(query, rec.instrument.name);
            }
            if (!match) {
                match = match || this.matchMember(query, rec.assessor);
            }
        }
        return match;
    }

    transform(array: any[], query: string, colName: string): any {
        if (query) {
            query = _.lowerCase(query);
            return _.filter(array, row => {
                let match = this.matchMember(query, row);
                match = match || this.matchAssessment(query, row);
                match = match || this.matchMember(query, row.administrator);
                match = match || this.matchMember(query, row.member);
                match = match || this.matchMember(query, row.assessor);
                match = match || this.matchResource(query, row);
                match = match || this.matchOrganization(query, row);
                match = match || this.matchOrganization(query, row.organization);
                match = match || this.matchAssessment(query, row.lastAssessment);
                return match;
            });
        }
        return array;
    }
}