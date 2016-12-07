import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'app-icon',
    template: `<ion-icon role="img" [class]="icon.getClass(name)"></ion-icon>`
})

export class AppIcon {
    @Input() name: string = "cog";

    constructor(public icon: IconProvider) {

    }
}
