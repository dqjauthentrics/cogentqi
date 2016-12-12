import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'app-icon',
    template: `<ion-icon role="img" [class]="icon.getClass(name) + ' ' + size"></ion-icon>`
})

export class AppIcon {
    @Input() name: string = "cog";
    @Input() size: string = "";

    constructor(public icon: IconProvider) {

    }
}
