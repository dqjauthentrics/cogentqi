import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "translate"})

export class Translate implements PipeTransform {
    transform(str: string): string {
        if (str) {
            return str;
        }
        return '';
    }
}