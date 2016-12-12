import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ResourceProvider} from "../../providers/resource";
import {Globals} from "../../providers/globals";

@Component({
    templateUrl: 'detail.html',
})
export class ResourceDetailPage {
    resource: any;
    content: any;

    constructor(private nav: NavController, private navParams: NavParams, resourceData: ResourceProvider, http: Http, private globals: Globals) {
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(resource => { //@todo move to resource data model
            this.resource = resource;
            http.get(this.globals.URL_API + 'resource/content/nursing:nrs002')
                .subscribe(
                    res => {
                        let data: any = res.json();
                        this.content = data.data;
                        console.log('retrieved content ', this.content);
                    }
                );
        });
    }

    getContent() {
        return this.content? this.content : '<h1>Nada</h1>';
    }

    adjustContent(content) {
        if (content) {
            let pos = content.indexOf('[VID:');
            if (pos >= 0) {
                let iframe = '<div class="video-embed"><iframe style="max-width:560px; max-height:315px; margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
                let replacer = '';
                for (let i = pos + 5; i < content.length && content.substr(i, 1) != ']'; i++) {
                    replacer += content.substr(i, 1);
                }
                iframe = iframe.replace('ZZZ', replacer);
                replacer = '[VID:' + replacer + ']';
                console.log('replacer', replacer);
                return content.replace(replacer, iframe);
            }
        }
        return '';
    }

}