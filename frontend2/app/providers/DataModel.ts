import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Config} from "./config";

@Injectable()
export class DataModel {
    baseUrl: string = '';
    name: string = '';
    data: any;
    http: Http;
    debug: boolean = true;

    constructor(name: string, http: Http, config: Config) {
        this.http = http;
        this.name = name;
        this.baseUrl = 'http://' + config.siteDir + '.dev2.cog/api3/' + name;
    }

    loadAll() {
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            var url = this.baseUrl + '/index/2/1/0';
            if (this.debug) {
                console.log('loading: ' + url);
            }
            this.http.get(url).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                if (this.debug) {
                    console.log(this.name + ' retrieved:', this.data);
                }
                resolve(this.data);
            });
        });
    }

    getAll() {
        return this.loadAll().then(data => this.data);
    }

    loadSingle(modelId) {
        if (this.debug) {
            console.log('loading ' + this.name + ':', modelId);
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
