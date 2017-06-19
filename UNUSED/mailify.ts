import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "mailify"})

export class Mailify implements PipeTransform {
    transform(email): string {
        if (email) {
            return '<a href="mailto:' + email + '">' + email + '</a>';
        }
        return '';
    }
}
