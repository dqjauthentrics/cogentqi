import {Component, Input} from "@angular/core";
import {Config} from "../providers/config";

@Component({
    selector: 'micro-badge',
    templateUrl: 'micro-badge.html'
})

export class MicroBadge {
    @Input() src: string = "";
    @Input() name: string = "";
    @Input() size: string = "small";

    constructor(private config: Config) {
    }

    getSrc(src) {
        return this.config.site + '/badges/' + src;
    }
}
