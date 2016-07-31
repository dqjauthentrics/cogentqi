import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "replace"
})

export class Replace implements PipeTransform {
    transform(value: string, fromStr: string, toStr: string): string {
        console.log(value, fromStr, toStr);
        return value.replace(fromStr, toStr);
    }
}
