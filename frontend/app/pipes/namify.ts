import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "namify"
})

export class Namify implements PipeTransform {
    transform(member): string {
        return member.fn + ' ' + member.ln
    }
}
