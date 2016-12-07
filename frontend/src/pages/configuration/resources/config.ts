import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ResourceProvider} from "../../../providers/resource";

@Component({
    templateUrl: 'config.html',
})
export class ResourceConfigPage {
    resource: any;

    constructor(private nav: NavController, private navParams: NavParams, resourceData: ResourceProvider, http: Http) {
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(resource => {
            this.resource = resource;
        });
    }
}