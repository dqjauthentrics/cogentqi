import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../../providers/resource";
import {ResourceConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgResourcesListPage {
    public resources = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, resourceData: ResourceProvider) {
        let comp = this;
        this.loading = true;
        resourceData.getAll(null, false).then(resources => {
            comp.resources = resources;
            comp.loading = false;
        });
    }

    configureResource(resource) {
        this.nav.push(ResourceConfigPage, resource);
    }
}
