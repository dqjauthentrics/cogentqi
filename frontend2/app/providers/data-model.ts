import {Headers, RequestOptions, Http} from "@angular/http";
import {Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Config} from "./config";

@Injectable()
export class DataModel {
    baseUrl: string = '/api3';
    name: string = '';
    list: any;
    single: any;
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
        if (this.list) {
            return Promise.resolve(this.list);
        }
        return new Promise(resolve => {
            var url = this.baseUrl + '/index' + (typeof args == 'string' ? args : '');
            if (this.debug) {
                console.log('loading all ' + this.name + 's:' + url);
            }
            this.http.get(url).subscribe(res => {
                var jsonResponse = res.json();
                this.list = jsonResponse.data;
                if (this.debug) {
                    console.log(this.name + 's retrieved:', this.list);
                }
                resolve(this.list);
            });
        });
    }

    getAll(args: string) {
        return this.loadAll(args).then(data => this.list);
    }

    loadSingle(modelId) {
        if (this.debug) {
            console.log('loading single ' + this.name + ':', modelId);
        }
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/single/' + modelId).subscribe(res => {
                var jsonResponse = res.json();
                this.single = jsonResponse.data;
                if (this.debug) {
                    console.log('model retrieved:', this.single);
                }
                resolve(this.single);
            });
        });
    }

    getSingle(modelId) {
        return this.loadSingle(modelId).then(data => this.single);
    }

    update(data: any) {
        let body = JSON.stringify({data});
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = this.baseUrl + '/update';
        console.log('update:' + url);
        this.http.post(url, body, options).subscribe(res => {
            console.log(this.name + 'update returns:');
        });
    }
}
