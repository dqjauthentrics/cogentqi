import {Injectable} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Http} from "@angular/http";

@Injectable()
export class Config {
    data: any;
    appName = "Cogic";
    copyright = "Copyright \u00a9 2015, CogentQI.com.  All rights reserved.";
    trademarkName = "CogentQI&#8482;";
    name = "Demonstration";
    logo = '<img src="/site/default/images/hdrLogo.png" alt=""/>';
    site = '/site/default';
    siteDir: string = 'default';
    css: string = this.site + '/theme.css';
    translations: string = this.site + '/translations';
    fullLogo: string = '<img src="/site/default/images/hdrLogo.png" alt=""/>';

   // public roles = {'A': 'Administrator', 'M': 'Manager', 'N':'Nurse', 'P': 'Physician Assistant',}

    constructor(private window: Window, private translate: TranslateService, private http: Http) {
        try {
            var hostname = this.window.location.hostname;
            var parts = hostname.split('.');
            if (parts.length >= 2 && parts[0]) {
                this.siteDir = parts[0];
                this.site = '/site/' + this.siteDir;
                this.css = this.site + '/theme.css';
                this.translations = this.site + '/translations';
                window.document.getElementById('theme').setAttribute('href', this.css);
                this.load();
                //translate.resetLang('en');
                //translate.use('../../' + this.siteDir + '/translations/en');
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }

    load() {
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            this.http.get(this.site + '/config.json').subscribe(res => {
                this.data = this.processData(res.json());
                resolve(this.data);
            });
        });
    }

    processData(jsonObject) {
        if (jsonObject.logo) {
            this.logo = jsonObject.logo;
        }
        if (jsonObject.fullLogo) {
            this.fullLogo = jsonObject.fullLogo;
        }
        if (jsonObject.copyright) {
            this.copyright = jsonObject.copyright;
        }
        if (jsonObject.trademarkName) {
            this.trademarkName = jsonObject.trademarkName;
        }
        if (jsonObject.appName) {
            this.appName = jsonObject.appName;
        }
    }
}