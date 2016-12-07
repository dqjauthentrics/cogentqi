import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "namify"})

export class Namify implements PipeTransform {
    transform(member: any, firstIsFirst: boolean): string {
        if (member && member.firstName) {
            return firstIsFirst ? member.firstName + ' ' + member.lastName : member.lastName + ', ' + member.firstName;
        }
        return '';
    }
}
