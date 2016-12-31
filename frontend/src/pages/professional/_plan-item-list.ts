import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {IconProvider} from "../../providers/icon";
import {ResourceDetailPage} from "../../pages/resource/detail";

@Component({
    selector: 'plan-item-list',
    templateUrl: '_plan-item-list.html'
})
export class PlanItemList {
    @Input() items: Array<any>;
    @Input() loading: boolean;

    public filterQuery = "";
    public rowsOnPage = 10;
    public sortBy = "statusStamp";
    public sortOrder = "desc";

    constructor(private nav: NavController, public icon: IconProvider) {
    }

    goToResource(resource) {
        this.nav.push(ResourceDetailPage, resource);
    }
}
