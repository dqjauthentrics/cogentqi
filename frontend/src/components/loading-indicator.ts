import {Component, Input} from "@angular/core";

@Component({
    selector: 'loading-indicator',
    template: `<ion-spinner [hidden]="!loading" name="dots"></ion-spinner>`
})

export class LoadingIndicator {
    @Input() loading: boolean = false;
}
