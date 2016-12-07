import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'account.html',
})
export class AccountPage {
    public base64Image: string;

    constructor(private alertCtrl: AlertController, private nav: NavController, private session: SessionProvider) {
    }

    takeSnapshot() {
    }

    updatePicture() {
        console.log('Clicked to update picture');
    }

    changeEmail() {
        let comp = this;
        let alert = this.alertCtrl.create({
            title: 'Change Email',
            message: 'Email change:',
            buttons: [
                {
                    text: 'Email',
                    handler: () => {
                        comp.getEmail();
                    }
                },
                {
                    text: 'Cancel',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }

    getEmail() {
        /**
         * @todo
         */
        //this.userData.getUsername().then((username) => {
        //    this.username = username;
        //});
    }

    changePassword() {
        console.log('Clicked to change password');
    }

    logout() {
        this.session.logout();
        this.nav.setRoot(LoginPage);
    }
}
