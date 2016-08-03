import {Component} from "@angular/core";
import {DomSanitizationService} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {ResourceProvider} from "../../providers/resource";

@Component({
    templateUrl: 'build/pages/resource/detail.html',
})
export class ResourceDetailPage {
    resource: any;
    content: any;

    constructor(private nav: NavController, private navParams: NavParams, resourceData: ResourceProvider, http: Http, private sanitizer: DomSanitizationService) {
        var that = this;
        this.resource = this.navParams.data;
        resourceData.getSingle(this.resource.id).then(resource => {
            this.resource = resource;
            http.get('http://pharmacy.dev2.cog/api3/resource/content/nursing:nrs002')
                .map(res => res.text())
                .subscribe(
                    res => this.content = this.adjustContent(res),
                    () => console.log('retrieved content ', this.content)
                );
        });
    }

    adjustContent(content) {
        var pos = content.indexOf('[VID:');
        if (pos >= 0) {
            var iframe = '<div class="video-embed"><iframe style="max-width:560px; max-height:315px; margin: 0 auto;" width="560" height="315" src="https://www.youtube.com/embed/ZZZ" frameborder="0" allowfullscreen></iframe></div>';
            var replacer = '';
            for (var i = pos + 5; i < content.length && content.substr(i, 1) != ']'; i++) {
                replacer += content.substr(i, 1);
            }
            iframe = iframe.replace('ZZZ', replacer);
            replacer = '[VID:' + replacer + ']';
            console.log('replacer', replacer);
        }
        return content.replace(replacer, iframe);
    }

}