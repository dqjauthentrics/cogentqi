import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'app-icon',
    template: `<i role="img" [class]="getIconClass() + (dirty? ' dirty':'') + ' '+color"></i>`
})

export class AppIcon {
    @Input() name: string = "cog";
    @Input() size: string = "";
    @Input() dirty: boolean = false;
    @Input() spinning: boolean = false;
    @Input() color: string = "";

    constructor(public icon: IconProvider) {
    }

    getIconClass() {
        return (this.spinning ? this.icon.getClass('spinner') : this.icon.getClass(this.name));
    }
}
