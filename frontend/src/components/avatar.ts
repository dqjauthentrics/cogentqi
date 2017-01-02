import {Component, Input} from "@angular/core";
import {Config} from "../providers/config";

@Component({
    selector: 'avatar',
    template: `<img *ngIf="src && id" [src]="src(id)" [class]="'avatar-'+size" alt=""/>`
})

export class Avatar {
    @Input() size: string = "tiny";
    @Input() id: number = 0;

    constructor(private config: Config) {
    }

    src(id) {
        return this.config.site + '/avatars/' + id + '.png';
    }
}
