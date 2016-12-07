import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'email',
    template: `
        <a [href]="'mailto:'+address"><ion-icon role="img" [class]="icon.getClass('mail')"></ion-icon></a> 
        <a *ngIf="includeText" [href]="'mailto:'+address">{{address}}</a>`
})

export class Email {
    @Input() includeText: boolean = false;
    @Input() address: string = '';

    constructor(public icon: IconProvider) {

    }
}
