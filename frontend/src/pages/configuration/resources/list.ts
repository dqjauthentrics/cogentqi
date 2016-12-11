import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../../providers/resource";
import {ResourceConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgResourcesListPage {
    resources = [];
    queryText: string;

    constructor(private nav: NavController, resourceData: ResourceProvider) {
        resourceData.getAll(null, false).then(resources => {
            this.resources = resources;
        });
    }

    configureResource(resource) {
        this.nav.push(ResourceConfigPage, resource);
    }
}
