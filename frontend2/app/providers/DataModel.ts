import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class DataModel {
    baseUrl: string = 'http://pharmacy.dev2.cog/api3/';
    name: string = '';
    data: any;
    http: Http;

    constructor(name: string, http: Http) {
        this.http = http;
        this.name = name;
        this.baseUrl += name;
    }

    loadAll() {
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            var url = this.baseUrl + '/index/2/1/0';
            console.log('loading: ' + url);
            this.http.get(url).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                console.log(this.name + ' retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getAll() {
        return this.loadAll().then(data => this.data);
    }

    loadSingle(modelId) {
        console.log('loading model:', modelId);
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/single/' + modelId).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                console.log('model retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getSingle(modelId) {
        return this.loadSingle(modelId).then(data => this.data);
    }

}
