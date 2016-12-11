import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "space2Break"})

export class Space2break implements PipeTransform {
    transform(str: string): string {
        if (str) {
            return str.replace(' ', '<br>');
        }
        return '';
    }
}
