import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

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
            if (!match && rec.roleName) {
                match = match || this.match(query, rec.roleName);
            }
        }
        return match;
    }

    matchResource(query, rec) {
        let match = false;
        if (rec) {
            if (rec.title) {
                match = match || this.match(query, rec.title);
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
                //console.log('row', row);
                let match = this.matchMember(query, row);
                match = match || this.matchMember(query, row.administrator);
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