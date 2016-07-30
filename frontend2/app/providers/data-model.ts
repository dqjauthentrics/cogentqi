import {Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Config} from "./config";

@Injectable()
export class DataModel {
    baseUrl: string = 'http://pharmacy.dev.cog/api3';
    name: string = '';
    data: any;
    debug: boolean = true;

    constructor(name: string, protected http: Http, config: Config, protected events: Events) {
        this.name = name;
        this.baseUrl = 'http://' + config.siteDir + '.dev2.cog/api3/' + name;
    }

    static buildArgs(args) {
        var argStr = '';
        if (args) {
            argStr = '/' + args.join('/');
        }
        return argStr;
    }

    loadAll(args: string) {
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            var url = this.baseUrl + '/index' + (typeof args == 'string' ? args : '');
            if (this.debug) {
                console.log('loading all ' + this.name + 's:' + url);
            }
            this.http.get(url).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                if (this.debug) {
                    console.log(this.name + 's retrieved:', this.data);
                }
                resolve(this.data);
            });
        });
    }

    getAll(args: string) {
        return this.loadAll(args).then(data => this.data);
    }

    loadSingle(modelId) {
        if (this.debug) {
            console.log('loading single ' + this.name + ':', modelId);
        }
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/single/' + modelId).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                if (this.debug) {
                    console.log('model retrieved:', this.data);
                }
                resolve(this.data);
            });
        });
    }

    getSingle(modelId) {
        return this.loadSingle(modelId).then(data => this.data);
    }

}
