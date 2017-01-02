import {Component, Input} from "@angular/core";
import {NavController} from "ionic-angular";
import {IconProvider} from "../../providers/icon";
import {ResourceDetailPage} from "../resource/detail";
import {Namify} from "../../pipes/namify";

@Component({
    selector: 'plan-item-list',
    templateUrl: '_plan-item-list.html'
})
export class PlanItemList {
    @Input() items: Array<any>;
    @Input() memberId: number;
    @Input() loading: boolean;

    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "statusStamp";
    public sortOrder = "desc";

    constructor(private nav: NavController, public icon: IconProvider) {
    }

    goToResource(resource) {
        this.nav.push(ResourceDetailPage, resource);
    }

    sortResource(planItem) {
        return planItem.resource.name;
    }

    sortMember(planItem) {
        let name = '';
        if (planItem.member) {
            let namifier = new Namify();
            name = namifier.transform(planItem.member, false);
        }
        return name;
    }
}
