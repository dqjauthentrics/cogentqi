import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OrganizationProvider} from "../../providers/organization";

@Component({
    templateUrl: 'detail.html'
})
export class OrganizationDetailPage {
    public organization: any;

    constructor(private nav: NavController, private navParams: NavParams, organizationData: OrganizationProvider) {
        this.organization = this.navParams.data;
        organizationData.getSingle(this.organization.id).then(organization => {
            this.organization = organization;
        });
    }

}
