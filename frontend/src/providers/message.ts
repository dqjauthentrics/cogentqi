import {Injectable} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class MessageProvider extends DataModel {

    constructor(protected toastCtrl: ToastController, protected http: Http, protected globals: Globals, protected config: Config, protected session: SessionProvider) {
        super('message', toastCtrl, http, globals, config, session);
    }

    send(member, message) {
        if (message && member) {
            this.http.post(this.baseUrl + 'send', {senderId: this.session.user.id, memberId: member.id, message: message})
                .subscribe(
                    res => {
                        this.globals.alertSuccess('Message sent.');
                    },
                    err => {
                        this.displayError('Sorry! There was a problem sending the message.');
                    });
        }
    }
}
