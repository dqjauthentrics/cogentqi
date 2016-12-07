import {Component, Input} from "@angular/core";

@Component({
    selector: '<avatar></avatar>',
    template: `<img [src]="src" [class]="'avatar-'+size" alt=""/>`
})

export class Avatar {
    @Input() size: string = "tiny";
    @Input() src: string = "";

}
