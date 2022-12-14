import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";
import {ToastController} from "ionic-angular";

@Injectable()
export class DataModel {
    protected result: any;

    baseUrl: string = '/assets/api';
    list: any;
    single: any;

    constructor(protected name: string, protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
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
        let options = new RequestOptions({
            headers: headers
        });
        return options;
    }

    checkResult(result, notify: boolean) {
        if (result.code !== 200) {
            console.error('COGIC SERVER ERROR: ' + result.message);
        }
        if (notify) {
            let toast = this.toastCtrl.create({
                message: result && result.code !== 200 ? result.message : 'Okay!',
                duration: 4000,
                position: 'middle',
                showCloseButton: true,
                closeButtonText: 'Dismiss',
                dismissOnPageChange: true,
                cssClass: result && result.code === 200 ? "success" : "error"
            });
            toast.present();
        }
        if (result && result.code === 500 && result.message && result.message.indexOf('Not logged in') >= 0) {
            console.log('loadData::logging out...');
            this.session.logout();
        }
    }

    loadData(urlSegment: string) {
        let provider = this;
        let url = this.baseUrl + urlSegment;
        if (this.globals.debug) {
            console.log('data loading: ' + url);
        }
        return new Promise(resolve => {
            this.http.get(url).subscribe(
                res => {
                    try {
                        let jsonResponse = res.json();
                        if (jsonResponse.code !== 200) {
                            provider.globals.alertError('Sorry.  There was an error loading data from the server.  Please try again.');
                            console.error('loadData::ERROR FOR:' + url + '::RESULT=' + jsonResponse.message);
                        }
                        let data = jsonResponse.data;
                        if (this.globals.debug) {
                            console.log('loadData(' + url + ')::jsonResponse: ', jsonResponse);
                            console.log('loadData(' + url + ')::data retrieved::', data);
                        }
                        resolve(data);
                    }
                    catch (exception) {
                        console.error('COGIC DATA LOAD ERROR:', exception);
                    }
                },
                err => {
                    this.checkResult(err, true);
                }
            );
        });
    }

    getData(urlSegment: string) {
        return this.loadData(urlSegment);
    }

    displayError(err) {
        console.log(err);
        try {
            let toast = this.toastCtrl.create({
                message: 'Sorry.  An error occurred on the server.' + (err.status !== 500 ? err.message : ''),
                position: 'middle',
                showCloseButton: true,
                closeButtonText: 'Dismiss',
                dismissOnPageChange: true,
                cssClass: "error"
            });
            toast.present();
        }
        catch (exception) {
            console.error("COGIC ERROR:", exception);
        }
    }


    unsetList() {
        this.list = null;
    }

    getAll(args: string, resetFirst: boolean) {
        if (resetFirst) {
            this.unsetList();
        }
        else {
            if (this.list) {
                console.log("RETURNING PROMISE:", this.list);
                return Promise.resolve(this.list);
            }
        }
        let url = '/list' + (typeof args === 'string' ? args : '');
        return this.getData(url).then(
            data => {
                this.list = data;
                return this.list;
            }
        );
    }

    getSingle(modelId: number) {
        return this.getData('/single/' + modelId).then(
            data => {
                this.single = data;
                return this.single;
            },
            error => {
                this.globals.alertError('Error loading ' + this.name + ' data record.');
            }
        );
    }

    getPostData(urlSegment: string, data: any, notify: boolean) {
        let provider = this;
        let body = JSON.stringify({data});
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = this.baseUrl + urlSegment;
        if (provider.globals.debug) {
            console.log('postData:' + url, data);
        }
        return new Promise(resolve => {
            this.http.post(url, body, options).subscribe(
                result => {
                    try {
                        let jsonResponse = result.json();
                        this.checkResult(jsonResponse, notify);
                        let data = jsonResponse.data;
                        if (provider.globals.debug) {
                            console.log(url + ':post returned:', data);
                        }
                        resolve(data);
                    }
                    catch (exception) {
                        console.error("COGIC POSTERROR:", exception, result);
                    }
                },
                error => {
                    this.globals.alertError('There was an error on the server.');
                }
            );
        });
    }

    update(data: any, notify: boolean) {
        return this.getPostData('/update', data, notify);
    }

    remove(id: number, notify: boolean) {
        return this.getData('/delete/' + id);
    }

    add(data: any, notify: boolean) {
        return this.getPostData('/add', data, notify);
    }
}
