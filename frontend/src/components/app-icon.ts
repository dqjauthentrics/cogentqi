import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'app-icon',
    template: `<i role="img" [class]="icon.getClass(name) + (dirty? ' dirty':'')"></i>`
})

export class AppIcon {
    @Input() name: string = "cog";
    @Input() size: string = "";
    @Input() dirty: boolean = false;

    constructor(public icon: IconProvider) {
    }

 }
