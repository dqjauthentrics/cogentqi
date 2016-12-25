import {Injectable} from "@angular/core";
import {LoadingController, AlertController, Events} from "ionic-angular";

@Injectable()
export class Globals {
    public tabMode: string = 'normal';
    public static isProduction: boolean = true;
    public debug: boolean = true;
    public loadingObject: any = null;

    public readonly STATUS_ERROR = 'error';
    public readonly STATUS_SUCCESS = 'success';
    public readonly STATUS_WARNING = 'warning';
    public readonly STATUS_INFO = 'info';

    public readonly URL_API = '/assets/api/';
    public readonly MESSAGE_DURATION = 14000;

    public alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


    constructor(private loading: LoadingController, private alerts: AlertController, private events: Events) {
    }

    public safeName(str) {
        if (str) {
            let name = str.replace(/\W+/g, '');
            name = name.replace(/[^a-zA-Z0-9]/g, '');
            return name;
        }
        return str;
    }

    public showLoading(message) {
        this.loadingObject = this.loading.create({content: message, dismissOnPageChange: true});
        this.loadingObject.present();
        return this.loadingObject;
    }

    public dismissLoading() {
        if (this.loadingObject) {
            this.loadingObject.dismiss();
            this.loadingObject = null;
        }
    }

    public alert(title, message, cssClass) {
        this.alerts.create({title: title, subTitle: message, buttons: ['Dismiss'], cssClass: cssClass}).present();
    }

    public alertError(message) {
        this.alert('Error', message, 'error');
    }

    public alertWarning(message) {
        this.alert('Warning', message, 'warning');
    }

    public alertInfo(message) {
        this.alert('FYI', message, 'info');
    }

    public alertSuccess(message) {
        this.alert('Success!', message, 'success');
    }

    public confirm(message, cbFn) {
        let alert = this.alerts.create({
            title: 'Confirmation',
            message: message,
            cssClass: 'warning',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',

                },
                {
                    text: 'Confirmed',
                    handler: () => {
                        cbFn();
                    }
                }
            ]
        });
        alert.present();
    }
}