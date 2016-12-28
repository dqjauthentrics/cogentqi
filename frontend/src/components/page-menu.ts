import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {IconProvider} from "../providers/icon";

export interface PageMenuItem {
    page: any;
    icon: string;
    name: string;
    description: string;
}

@Component({
    selector: 'page-menu',
    templateUrl: './page-menu.html'
})

export class PageMenu {
    @Input() items: Array<PageMenuItem>;

    constructor(private nav: NavController, public icon: IconProvider) {
    }

    goToPage(item) {
        this.nav.push(item.page);
    }
}
