import {Component} from "@angular/core";
import {NavController, Alert} from "ionic-angular";
import {LoginPage} from "../login/login";
import {SessionProvider} from "../../providers/session";

@Component({
    templateUrl: 'build/pages/account/account.html',
})
export class AccountPage {
    public base64Image: string;

    constructor(private nav: NavController, private session: SessionProvider) {
    }

    takeSnapshot() {
    }

    updatePicture() {
        console.log('Clicked to update picture');
    }

    changeEmail() {
        let alert = Alert.create({
            title: 'Change email',
            buttons: [
                'Cancel'
            ]
        });
        alert.addInput({
            name: 'email',
            value: this.session.user.email,
            placeholder: 'email'
        });
        alert.addButton({
            text: 'Ok',
            handler: data => {
                // @todo
                ///this.userData.setUsername(data.username);
                this.getEmail();
            }
        });

        this.nav.present(alert);
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
