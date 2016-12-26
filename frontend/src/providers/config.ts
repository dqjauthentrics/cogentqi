import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class Config {
    public static isProduction: boolean = Config.checkProduction();

    public data: any;
    public appName = "NOCTI";
    public copyright = "Copyright \u00a9 2015, PLS 3rd Learning.com.  All rights reserved.";
    public trademarkName = "PLS 3rd Learning&#8482;";
    public name = "Demonstration";
    public site = '/assets/site/default';
    public siteDir: string = 'default';
    public css: string = this.site + '/theme.css';
    public translations: string = this.site + '/translations';
    public logoFull: string = '/assets/site/default/images/logoFull.png';
    public logoHeader: string = '/assets/site/default/images/logoHeader.png';
    public logoPrint: string = '/assets/site/default/images/logoPrint.png';
    public isAdmin: boolean = false;

    constructor(private http: Http) {
        try {
            let hostname = window.location.hostname;
            let parts = hostname.split('.');
            if (parts.length >= 2 && parts[0]) {
                if (parts[0] == 'admin') {
                    this.siteDir = parts[1];
                    this.isAdmin = true;
                }
                else {
                    this.siteDir = parts[0];
                }
                this.site = '/assets/site/' + this.siteDir;
                this.css = this.site + '/theme.css';
                this.translations = this.site + '/translations';
                this.logoFull = '/assets/site/' + this.siteDir + '/images/logoFull.png';
                this.logoHeader = '/assets/site/' + this.siteDir + '/images/logoHeader.png';
                this.logoPrint = '/assets/site/' + this.siteDir + '/images/logoPrint.png';
                let themeEl = window.document.getElementById('theme');
                if (themeEl) {
                    themeEl.setAttribute('href', this.css);
                }
                this.load();
            }
        }
        catch (exception) {
            console.log("ERROR:", exception);
        }
    }

    static checkProduction() {
        return window && window.location && window.location.hostname && window.location.hostname.indexOf('.com') > 0;
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