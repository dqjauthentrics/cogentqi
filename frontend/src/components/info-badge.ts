import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'info-badge',
    template: `<span [innerHTML]="n"></span>`
})

export class InfoBadge {
    @Input() n: string = '0';

    constructor(public icon: IconProvider) {

    }
}