import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'filter'})
export class FilterArrayPipe implements PipeTransform {
    private validKeys = ['title', 'name', 'firstName', 'lastName', 'roleName', 'jobTitle', 'organization', 'organization'];
    transform(arrayItem, filterValue) {
        if (!arrayItem || !filterValue || filterValue == '') {
            return arrayItem;
        }
        else if (arrayItem) {
            return arrayItem.filter(item => {
                for (let key in item) {
                    let myKey: string = key.toString();
                    if (this.validKeys.indexOf(myKey) >= 0 && (typeof item[myKey] === 'string' || item[myKey] instanceof String)) {
                        if ((item[myKey].toLowerCase().indexOf(filterValue) !== -1)) {
                            return true;
                        }
                    }
                }
            });
        }
        return true;
    }
}