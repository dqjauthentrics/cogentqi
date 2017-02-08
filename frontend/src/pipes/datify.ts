import {Pipe, PipeTransform} from "@angular/core";
import {DatePipe} from "@angular/common";

@Pipe({name: "datify"})

export class Datify implements PipeTransform {
    constructor() {

    }

    transform(mySqlDateStr: any, includeTime: boolean): string {
        if (mySqlDateStr) {
            try {
                // Split into [ Y, M, D, h, m, s ]
                let t: Array<any> = [];
                t = mySqlDateStr.split(/[- :]/);
                let d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
                let dp = new DatePipe('en-US');
                return dp.transform(d, 'short');
            }
            catch (exception) {
                console.log('unable to convert date:', mySqlDateStr, exception);
                return mySqlDateStr;
            }
        }
        return '';
    }
}
