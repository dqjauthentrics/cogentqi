import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "phone"})

export class Phone implements PipeTransform {
    transform(str: string): string {
        if (str) {
            switch (str.length) {
                case 10:
                    str = '(' + str.substr(0, 3) + ') ' + str.substr(3, 3) + '-' + str.substr(6);
                    break;
                case 7:
                    str = str.substr(0, 3) + '-' + str.substr(3);
                    break;
            }
            return str;
        }
        return '';
    }
}