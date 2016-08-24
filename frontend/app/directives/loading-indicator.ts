import {Component, Input} from "@angular/core";

@Component({
    selector: '<loading-indicator></loading-indicator>',
    template: `<ion-spinner [hidden]="hidden" name="dots"></ion-spinner>`
})

export class LoadingIndicator {
    @Input() hidden: boolean = false;
}
