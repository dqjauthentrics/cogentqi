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
        //this.globals.showLoading('Loading resource...');
        this.resource = this.navParams.data;
        this.resourceData.getSingle(this.resource.id).then(resource => { //@todo move to resource data model
            comp.resource = resource;
            comp.resourceData.getContent(resource).then((content: any) => {
                comp.content = sanitizer.bypassSecurityTrustHtml(this.adjustContent(content));
                //this.globals.dismissLoading();
            });
        });
    }

    theContent() {
        return this.content;
    }

    adjustContent(content: any) {
        if (content) {
            let pos = content.indexOf('[VID:');
            let wd = window.innerWidth;
            let ht = window.innerHeight;
            if (ht < wd) {
                wd = ht;
            }
            ht = wd / 1.2;
            while (pos >= 0) {
                // let iframe = '<div class="video-embed"><iframe style="max-width:' + wd + 'px; max-height:' + ht + 'px; margin: 0 auto;" width="' + wd + '" height="' + ht +
                //    '" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
                // iframe = '<div class="video-embed"><object style="width:' + wd + 'px; height:2000px;" data="http://www.youtube.com/embed/ZZZ"> </object></div>';

                let iframe = '<div class="videoWrapper">' +
                '<iframe width="560" height="349" src="http://www.youtube.com/embed/ZZZ?rel=0&hd=1" frameborder="0" allowfullscreen></iframe>' +
                '</div>';

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