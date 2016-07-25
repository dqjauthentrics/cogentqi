import {Injectable} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";

@Injectable()
export class Config {
    appName = "Cogic";
    copyright = "Copyright \u00a9 2015, CogentQI.com.  All rights reserved.";
    trademarkName = "CogentQI&#8482;";
    name = "Demonstration";
    logo = '<img src="/site/default/images/hdrLogo.png" alt=""/>';
    site = '/site/default';
    siteDir: string = 'default';
    css: string = this.site + '/theme.css';
    translations: string = this.site + '/translations';

    constructor(private window: Window, private translate: TranslateService) {
        try {
            var hostname = this.window.location.hostname;
            var parts = hostname.split('.');
            if (parts.length >= 2 && parts[0]) {
                this.siteDir = parts[0];
                this.site = '/site/' + this.siteDir;
                this.css = this.site + '/theme.css';
                this.translations = this.site + '/translations';
                window.document.getElementById('theme').setAttribute('href', this.css);
                //translate.resetLang('en');
                //translate.use('../../' + this.siteDir + '/translations/en');
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
}