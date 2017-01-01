import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {PlanItemProvider} from "../../providers/plan-item";
import {IconProvider} from "../../providers/icon";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'list.html'
})
export class PlanItemsListPage {
    public planItems = [];
    public loading: boolean = true;
    public filterQuery = "";
    public rowsOnPage = 15;
    public sortBy = "orderedOn";
    public sortOrder = "desc";
    public recommendedItems: Array<any> = [];
    public completedItems: Array<any> = [];
    public inProgressItems: Array<any> = [];

    constructor(private nav: NavController, private session: SessionProvider, private planItemProvider: PlanItemProvider, public icon: IconProvider) {
    }

    ngOnInit() {
        if (this.session.user) {
            this.loading = true;
            this.planItemProvider.forOrganization(this.session.user.organizationId).then((planItems: any) => {
                this.planItems = planItems;
                for (let planItem of this.planItems) {
                    switch (planItem.planItemStatusId) {
                        case this.planItemProvider.STATUS_COMPLETED:
                            this.completedItems.push(planItem);
                            break;
                        case this.planItemProvider.STATUS_RECOMMENDED:
                            this.recommendedItems.push(planItem);
                            break;
                        case this.planItemProvider.STATUS_ENROLLED:
                            this.inProgressItems.push(planItem);
                            break;
                    }
                }
                this.loading = false;
            });
        }
    }

}
