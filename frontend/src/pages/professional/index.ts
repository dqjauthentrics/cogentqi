import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {PlanItemProvider} from "../../providers/plan-item";
import {IconProvider} from "../../providers/icon";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'index.html'
})
export class ProfessionalPage {
    public planItems = [];
    public loading: boolean = false;
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
            this.planItemProvider.forMember(this.session.user.organizationId, this.session.user.id).then((planItems: any) => {
                this.loading = true;
                this.planItems = planItems;
                this.loading = false;
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
            });
        }
    }

}
