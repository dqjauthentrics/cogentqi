import {Component, Input} from "@angular/core";
import {UserProvider} from "../providers/user";
import {Alert, NavController} from "ionic-angular";

@Component({
    selector: '<header-bar [title]="title"></header-bar>',
    templateUrl: 'build/directives/header-bar.html'
})

export class HeaderBar {
    @Input() title: string = "Cogic";

    constructor(private nav: NavController, private user: UserProvider) {
    }

    logOut() {
        let confirm = Alert.create({
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
                        this.user.logout();
                    }
                }
            ]
        });
        this.nav.present(confirm);
    }
}