import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../providers/resource";
import {ResourceDetailPage} from "./detail";

@Component({
    templateUrl: 'list.html'
})
export class ResourceListPage {
    public resources = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, resourceData: ResourceProvider) {
        this.loading = true;
        resourceData.getAll(null, false).then(resources => {
            this.resources = resources;
            this.loading = false;
        });
    }

    goToResourceDetail(resourceName: string) {
        this.nav.push(ResourceDetailPage, resourceName);
    }
}
