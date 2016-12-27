import {Component} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
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

    constructor(private nav: NavController, private navParams: NavParams, resourceData: ResourceProvider, http: Http, private globals: Globals, private sanitizer: DomSanitizer) {
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(resource => { //@todo move to resource data model
            this.resource = resource;
            http.get(this.globals.URL_API + 'resource/content/nursing:nrs002')
                .subscribe(
                    res => {
                        let jsonResult: any = res.json();
                        this.content = jsonResult.data;
                        this.content = sanitizer.bypassSecurityTrustHtml(this.adjustContent(this.content));
                    }
                );
        });
    }

    getContent() {
        return this.content ? this.content : '<h1>No content found for course.</h1>';
    }

    adjustContent(content) {
        console.log('adjusting...');
        if (content) {
            let pos = content.indexOf('[VID:');
            console.log('adjusting pos::', pos);

            if (pos >= 0) {
                let iframe = '<div class="video-embed"><iframe style="max-width:560px; max-height:315px; margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
                //iframe = '<div class="video-embed"><object style="width:50%; max-width: 600px; min-width:250px; height:auto;" data="http://www.youtube.com/embed/ZZZ"> </object></div>';
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