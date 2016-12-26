import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {OrganizationProvider} from "../../providers/organization";
import {SessionProvider} from "../../providers/session";
import {OrganizationDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";
import {IconProvider} from "../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class OrganizationListPage {
    public loading: boolean = false;
    public organizations = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, private session: SessionProvider, organizationData: OrganizationProvider, public icon: IconProvider) {
        this.loading = true;
        let organizationId = this.session.user.organizationId;
        let drilldown = 1;
        let includeInactive = 0;
        let args = [organizationId, drilldown, includeInactive];
        organizationData.getAll(DataModel.buildArgs(args), false).then(organizations => {
            this.organizations = organizations;
            for (let organization of this.organizations) {
                organization.visible = true;
            }
            this.loading = false;
            console.log('organization constructor loaded', this.organizations);
        });
    }

    goToOrganization(organization) {
        this.nav.push(OrganizationDetailPage, organization);
    }

    sortNameSummary(organization: any) {
        return organization.name + ' ' + organization.summary;
    }
    sortAddress(organization: any) {
        return organization.state + ' ' + organization.city + ' ' + organization.address;
    }
}
