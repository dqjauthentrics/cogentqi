import {Component, Input} from "@angular/core";

@Component({
    selector: 'micro-badge-count',
    templateUrl: 'micro-badge-count.html'
})

export class MicroBadgeCount {
    @Input() n: number = 0;
}
