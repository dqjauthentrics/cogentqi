import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'filter'})
export class FilterArrayPipe implements PipeTransform {
    private validKeys = ['name', 'jobTitle', 'organizationName', 'roleName', 'summary', 'description', 'roleName', 'firstName', 'lastName', 'organization', 'jobTitle'];
    transform(arrayItem, filterValue) {
        if (!filterValue || filterValue == undefined) {
            return arrayItem;
        }
        else if (arrayItem) {
            return arrayItem.filter(item => {
                for (let key in item) {
                    if (this.validKeys.indexOf(key) >= 0 && (typeof item[key] === 'string' || item[key] instanceof String)) {
                        if ((item[key].toLowerCase().indexOf(filterValue) !== -1)) {
                            return true;
                        }
                    }
                }
            });
        }
        return true;
    }
}