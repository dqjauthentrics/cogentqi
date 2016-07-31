import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'filter'})
export class FilterArrayPipe implements PipeTransform {
    transform(arrayItem, filterValue) {
        if (!filterValue || filterValue == undefined) {
            return arrayItem;
        }
        else if (arrayItem) {
            return arrayItem.filter(item => {
                for (let key in item) {
                    if ((typeof item[key] === 'string' || item[key] instanceof String)) {
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