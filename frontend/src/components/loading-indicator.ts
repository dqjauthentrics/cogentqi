import {Component, Input} from "@angular/core";

@Component({
    selector: 'loading-indicator',
    template: `<div [hidden]="!loading"><ion-spinner name="circles"></ion-spinner> Loading data...</div>`
})

export class LoadingIndicator {
    @Input() loading: boolean = false;
}
