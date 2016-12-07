import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../providers/resource";
import {ResourceDetailPage} from "./detail";

@Component({
    templateUrl: 'list.html'
})
export class ResourceListPage {
    resources = [];

    constructor(private nav: NavController, resourceData: ResourceProvider) {
        resourceData.getAll(null).then(resources => {
            this.resources = resources;
        });
    }

    goToResourceDetail(resourceName: string) {
        this.nav.push(ResourceDetailPage, resourceName);
    }
}