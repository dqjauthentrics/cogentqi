import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Globals} from "./globals";
import {Config} from "./config";
import {ToastController} from "ionic-angular";

@Injectable()
export class DataModel {
    protected result: any;

    baseUrl: string = '/assets/api';
    list: any;
    single: any;

    constructor(protected name: string, protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config) {
        this.name = this.constructor.name.replace('Provider', '').toLowerCase();
        this.baseUrl = '/assets/api/' + name;
    }

    static buildArgs(args) {
        let argStr = '';
        if (args) {
            argStr = '/' + args.join('/');
        }
        return argStr;
    }

    static postOptions() {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        });
        return new RequestOptions({
            headers: headers
        });
    }

    checkResult(result) {
        let toast = this.toastCtrl.create({
            message: result && result.code != 200 ? result.message : 'Okay!',
            duration: 3000,
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'Dismiss',
            dismissOnPageChange: true,
            cssClass: "success"
        });
        toast.present();
    }

    displayError(err) {
        console.log(err);
        let toast = this.toastCtrl.create({
            message: 'Sorry.  An error occurred on the server.' + (err.status != 500 ? err.message : ''),
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'Dismiss',
            dismissOnPageChange: true,
            cssClass: "error"
        });
        toast.present();
    }

    loadAll(args: string) {
        let that = this;
        if (this.list) {
            return Promise.resolve(this.list);
        }
        return new Promise(resolve => {
            let url = this.baseUrl + '/list' + (typeof args == 'string' ? args : '');
            if (that.globals.debug) {
                console.log('loading all ' + this.name + 's:' + url);
            }
            this.http.get(url).subscribe(res => {
                let jsonResponse = res.json();
                this.list = jsonResponse.data;
                if (that.globals.debug) {
                    console.log(this.name + 's retrieved:', this.list);
                }
                resolve(this.list);
            });
        });
    }


    unsetList() {
        this.list = null;
    }

    getAll(args: string, resetFirst: boolean) {
        if (resetFirst) {
            this.unsetList();
        }
        return this.loadAll(args).then(data => this.list);
    }

    loadSingle(modelId) {
        let that = this;
        if (this.globals.debug) {
            console.log('loading single ' + this.name + ':', modelId);
        }
        return new Promise(resolve => {
            this.http.get(this.baseUrl + '/single/' + modelId).subscribe(res => {
                let jsonResponse = res.json();
                this.single = jsonResponse.data;
                if (that.globals.debug) {
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
        console.log('update:', data);
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
