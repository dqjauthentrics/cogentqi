import {Component, Input} from "@angular/core";
import {IconProvider} from "../providers/icon";

@Component({
    selector: 'micro-badge',
    templateUrl: 'micro-badge.html'
})

export class MicroBadge {
    @Input() src: string = "";
    @Input() text: string = "";
    @Input() size: string = "small";

    constructor(public icon: IconProvider) {

    }
}
