import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Globals} from "./globals";
import {Config} from "./config";
import {AlertController} from "ionic-angular";

@Injectable()
export class DataModel {
    protected result: any;

    baseUrl: string = '/assets/api/';
    list: any;
    single: any;

    constructor(protected name: string, protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config) {
        this.name = this.constructor.name.replace('Provider', '').toLowerCase();
        this.baseUrl = this.globals.URL_API + name + '/';
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

    displayStatus(msg: string, status: string) {
        let prompt = this.alertCtrl.create({
            title: 'Result',
            message: msg,
            cssClass: status,
            buttons: [
                {
                    text: 'Okay'
                }
            ]
        });
        prompt.present();
    }

    checkResult(result) {
        let msg = result && result.message ? result.message : 'Okay!';
        if (!result || result.code !== 200) {
            msg = 'Sorry.  An error occurred on the server.' + (result.message ? result.message : '');
            this.displayError(msg);
        }
        else {
            this.displaySuccess(msg);
        }
    }

    displayError(msg) {
        this.displayStatus(msg, this.globals.STATUS_ERROR);
    }

    displayWarning(msg) {
        this.displayStatus(msg, this.globals.STATUS_WARNING);
    }

    displayInfo(msg) {
        this.displayStatus(msg, this.globals.STATUS_INFO);
    }

    displaySuccess(msg) {
        this.displayStatus(msg, this.globals.STATUS_SUCCESS);
    }

    loadAll(args: string) {
        console.log('loadAll(' + this.name + ')');
        let that = this;
        if (this.list) {
            return Promise.resolve(this.list);
        }
        return new Promise(resolve => {
            let url = this.baseUrl + 'list' + (typeof args == 'string' ? args : '');
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
        console.log('getAll(' + this.name + '): ' + (resetFirst? 'reset':'existing'), this.list);
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
            this.http.get(this.baseUrl + 'single/' + modelId).subscribe(res => {
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
        let url = this.baseUrl + 'update';
        console.log('update:' + url);
        this.http.post(url, body, options).subscribe(res => {
            console.log(this.name + 'update returns:');
        });
    }
}
