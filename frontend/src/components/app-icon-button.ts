import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'app-icon-button',
    template: `<button ion-button (click)="click"><ion-icon [name]="icon.getClass(name)"></ion-icon></button>`
})

/**
 * @todo THIS IS NOT YET WORKING - dqj
 */
export class AppIconButton {
    @Input() click: string = "alert('click')";
    @Input() name: string = "cog";

    constructor(public icon: IconProvider) {

    }
}
