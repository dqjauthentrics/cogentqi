import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../../providers/globals";
import {ResourceProvider} from "../../../providers/resource";

declare let Quill: any;

@Component({
    templateUrl: 'config.html',
})
export class ResourceConfigPage {
    resource: any;
    private resContentEditor: any = null;
    private resSummaryEditor: any = null;

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, resourceData: ResourceProvider, http: Http) {
        let comp = this;
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(resource => {
            comp.resource = resource;
            comp.resource.valid = true;
            http.get(this.globals.URL_API + 'resource/content/nursing:nrs002')
                .subscribe(
                    res => {
                        let data: any = res.json();
                        comp.resource.content = data.data;
                        console.log('retrieved content ', comp.resource.content);
                    }
                );
        });
    }

    ngAfterViewInit() {
        this.resSummaryEditor = new Quill('#resSummaryEditor', {
            theme: 'snow'
        });
        this.resContentEditor = new Quill('#resContentEditor', {
            theme: 'snow'
        });
    }

    save(resource) {
        this.globals.alertWarning('TODO: Save Resource');
        console.log(resource);
    }

    remove(resource) {
        let comp = this;
        this.globals.confirm('Are you sure you wish to remove this resource permanently?', function () {
            comp.globals.alertWarning('TODO: Remove Resource');
        });
        console.log(resource);
    }
}