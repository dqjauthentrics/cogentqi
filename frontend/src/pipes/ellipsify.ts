import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "ellipsify"})

export class Ellipsify implements PipeTransform {
    transform(str: string, maxLen: number): string {
        return (str && str.length > maxLen - 3 ? str.substr(0, maxLen) + '...' : str);
    }
}
