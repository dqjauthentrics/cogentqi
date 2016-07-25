import {Pipe} from "@angular/core";

@Pipe({
    name: "Replace"
})

export class Replace {
    static transform(value: string, fromStr: string, toStr: string):string {
        console.log(value, fromStr, toStr);
        return value.replace(fromStr, toStr);
    }
}
