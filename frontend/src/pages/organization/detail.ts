import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {OrganizationProvider} from "../../providers/organization";
import {MemberProvider} from "../../providers/member";

@Component({
    templateUrl: 'detail.html'
})
export class OrganizationDetailPage {
    public organization: any;
    public loading = true;

    constructor(private nav: NavController, private navParams: NavParams, organizationData: OrganizationProvider, memberProvider: MemberProvider) {
        this.organization = this.navParams.data;
        organizationData.getSingle(this.organization.id).then(organization => {
            this.organization = organization;
            this.loading = false;
        });
    }
}
