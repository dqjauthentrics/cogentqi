import {Injectable} from "@angular/core";
import {Events, AlertController} from "ionic-angular";
import {Http} from "@angular/http";
import {DataModel} from "./data-model";
import {Globals} from "./globals";
import {Config} from "./config";
import {SessionProvider} from "./session";

@Injectable()
export class MessageProvider extends DataModel {

    constructor(protected alertCtrl: AlertController, protected http: Http, protected globals: Globals, protected config: Config, private events: Events, private session: SessionProvider) {
        super('message', alertCtrl, http, globals, config);
    }

    send(member, message) {
        if (message && member) {
            this.http.post(this.baseUrl + 'send', {senderId: this.session.user.id, memberId: member.id, message: message})
                .subscribe(
                    res => {
                        this.displaySuccess('Message sent.');
                    },
                    err => {
                        this.displayError('Sorry! There was a problem sending the message.');
                    });
        }
    }
}
