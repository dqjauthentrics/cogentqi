import {Component} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../providers/config";
import {ResourceProvider} from "../../providers/resource";
import {Globals} from "../../providers/globals";

@Component({
    templateUrl: 'detail.html',
})
export class ResourceDetailPage {
    resource: any;
    content: any;

    constructor(private nav: NavController, private navParams: NavParams, private config: Config, private resourceData: ResourceProvider,
                private http: Http, private globals: Globals, private sanitizer: DomSanitizer) {
        let comp = this;
        this.globals.showLoading('Loading resource...');
        this.resource = this.navParams.data;
        this.resourceData.getSingle(this.resource.id).then(resource => { //@todo move to resource data model
            comp.resource = resource;
            comp.resourceData.getContent(resource).then((content) => {
                comp.content = sanitizer.bypassSecurityTrustHtml(this.adjustContent(content));
                this.globals.dismissLoading();
            });
        });
    }

    theContent() {
        console.log('content len=', this.content ? this.content.length : 'null');
        return this.content;
    }

    adjustContent(content) {
        if (content) {
            let pos = content.indexOf('[VID:');
            while (pos >= 0) {
                let iframe = '<div class="video-embed"><iframe style="max-width:560px; max-height:315px; margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
                //iframe = '<div class="video-embed"><object style="width:50%; max-width: 600px; min-width:250px; height:auto;" data="http://www.youtube.com/embed/ZZZ"> </object></div>';
                let replacer = '';
                for (let i = pos + 5; i < content.length && content.substr(i, 1) !== ']'; i++) {
                    replacer += content.substr(i, 1);
                }
                iframe = iframe.replace('ZZZ', replacer);
                replacer = '[VID:' + replacer + ']';
                content = content.replace(replacer, iframe);
                pos = content.indexOf('[VID:');
            }
        }
        return content;
    }

}