import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class ResourceData {
    data: any;

    constructor(private http: Http) {
    }

    load() {
        if (this.data) {
            //console.log('loading resources');
            return Promise.resolve(this.data);
        }
        return new Promise(resolve => {
            this.http.get('/api3/resource').subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                //console.log('resources retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getResources() {
        return this.load().then(data => this.data);
    }

    loadProfile(resourceId) {
        console.log('loading resource:', resourceId);
        return new Promise(resolve => {
            this.http.get('/api3/resource/getProfile/' + resourceId).subscribe(res => {
                var jsonResponse = res.json();
                this.data = jsonResponse.data;
                //console.log('resource retrieved:', this.data);
                resolve(this.data);
            });
        });
    }

    getProfile(resourceId) {
        return this.loadProfile(resourceId).then(data => this.data);
    }

}
