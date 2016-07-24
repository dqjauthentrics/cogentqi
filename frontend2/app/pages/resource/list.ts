import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceData} from "../../providers/resource";
import {ResourceDetailPage} from "./detail";

@Component({
    templateUrl: 'build/pages/resource/list.html'
})
export class ResourceListPage {
    resources = [];

    constructor(private nav: NavController, resourceData: ResourceData) {
        resourceData.getAll().then(resources => {
            console.log(resources);
            this.resources = resources;
        });
    }

    goToResourceDetail(resourceName: string) {
        this.nav.push(ResourceDetailPage, resourceName);
    }
}
