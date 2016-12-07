import {Directive, Input} from "@angular/core";

@Directive({
    selector: 'img[defaultUrl]',
    host: {
        '(error)': 'updateUrl()',
        '[src]': 'src'
    }
})
export class DefaultImage {
    @Input() src: string;
    @Input() defaultUrl: string;

    updateUrl() {
        this.src = this.defaultUrl;
    }
}