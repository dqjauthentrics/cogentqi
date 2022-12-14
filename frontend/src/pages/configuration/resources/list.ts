import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../../providers/resource";
import {ConfigResourcesPage} from "./config";
import {IconProvider} from "../../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class ConfigResourcesListPage {
    public resources = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, resourceData: ResourceProvider, public icon: IconProvider) {
        let comp = this;
        this.loading = true;
        resourceData.getAll(null, false).then(resources => {
            comp.resources = resources;
            comp.loading = false;
        });
    }

    configureResource(resource) {
        this.nav.push(ConfigResourcesPage, resource);
    }
}
