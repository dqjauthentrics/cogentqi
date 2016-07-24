import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";

@Component({
    templateUrl: 'build/pages/resource/detail.html'
})
export class ResourceDetailPage {
    resource: any;

    constructor(private nav: NavController, private navParams: NavParams) {
        this.resource = this.navParams.data;
    }

}
