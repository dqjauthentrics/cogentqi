import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class Config {
    data: any;
    public appName = "Cogic";
    public copyright = "Copyright \u00a9 2015, CogentQI.com.  All rights reserved.";
    public trademarkName = "CogentQI&#8482;";
    public name = "Demonstration";
    public logo = '<img src="/assets/site/default/images/hdrLogo.png" alt=""/>';
    public site = '/site/default';
    public siteDir: string = 'default';
    public css: string = this.site + '/theme.css';
    public translations: string = this.site + '/translations';
    public fullLogo: string = '<img src="/assets/site/default/images/hdrLogo.png" alt=""/>';

    constructor(protected http: Http) {
        try {
            let hostname = window.location.hostname;
            let parts = hostname.split('.');
            if (parts.length >= 2 && parts[0]) {
                this.siteDir = parts[0];
                this.site = '/assets/site/' + this.siteDir;
                this.css = this.site + '/theme.css';
                this.translations = this.site + '/translations';
                let themeElement = window.document.getElementById('theme');
                if (themeElement) {
                    themeElement.setAttribute('href', this.css);
                }
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
        let cfg = this;
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            this.http.get(this.site + '/config.json').subscribe(res => {
                cfg.data = cfg.processData(res.json());
                resolve(cfg.data);
            });
        });
    }

    processData(jsonObject) {
        if (jsonObject.headerLogo) {
            this.logo = jsonObject.headerLogo;
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