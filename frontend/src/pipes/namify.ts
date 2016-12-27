import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "namify"})

export class Namify implements PipeTransform {
    transform(member: any, firstIsFirst: boolean): string {
        if (member && member.firstName) {
            let name = '';
            if (firstIsFirst) {
                name = member.firstName ? member.firstName : '';
                name += member.midddleName ? ' ' + member.middleName : '';
                name += member.lastName ? ' ' + member.lastName : '';
            }
            else {
                name = member.lastName ? member.lastName : '';
                name += member.firstName ? ', ' + member.firstName : '';
                name += member.midddleName ? ' ' + member.middleName : '';
            }
            return name;
        }
        return '';
    }
}
