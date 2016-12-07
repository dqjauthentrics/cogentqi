import {Component, Input} from "@angular/core";
import {SessionProvider} from "../providers/session";
import {AlertController, NavController} from "ionic-angular";

@Component({
    selector: '<header-bar [title]="title"></header-bar>',
    templateUrl: 'header-bar.html'
})

export class HeaderBar {
    @Input() title: string = "Cogic";

    constructor(private alertCtrl: AlertController, private nav: NavController, private session: SessionProvider) {
    }

    logOut() {
        let confirm = this.alertCtrl.create({
            title: 'Log Out of the Application?',
            message: 'Are you sure you wish to log out of the application?',
            cssClass: 'danger',
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Log Me Out',
                    handler: () => {
                        this.session.logout();
                    }
                }
            ]
        });
        confirm.present();
    }
}