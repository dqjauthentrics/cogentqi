import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ResourceProvider} from "../../../providers/resource";
import {ResourceConfigPage} from "./config";

@Component({
    templateUrl: 'build/pages/configuration/resources/list.html'
})
export class ConfigureResourcesListPage {
    resources = [];

    constructor(private nav: NavController, resourceData: ResourceProvider) {
        resourceData.getAll(null).then(resources => {
            this.resources = resources;
        });
    }

    configureResource(resource) {
        this.nav.push(ResourceConfigPage, resource);
    }
}
