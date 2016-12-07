import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: '<app-icon-button></app-icon-button>',
    template: `<button (click)="click"><ion-icon role="img" [class]="icon.getClass(name)"></ion-icon></button>`
})

export class AppIconButton {
    @Input() click: string = "alert('click')";
    @Input() name: string = "cog";

    constructor(private icon: IconProvider) {

    }
}
