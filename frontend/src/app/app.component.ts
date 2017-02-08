import {Component, ViewChild, enableProdMode} from "@angular/core";
import {Events, Nav, Platform, App} from "ionic-angular";
import {Config} from "../providers/config";
import {Globals} from "../providers/globals";
import {InstrumentProvider} from "../providers/instrument";
import {RoleProvider} from "../providers/role";
import {EventProvider} from "../providers/event";
import {SessionProvider} from "../providers/session";
import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";

if (Globals.isProduction) {
    enableProdMode();
}

@Component({
    templateUrl: 'app.html'
})

export class CogicApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;

    constructor(private _app: App,
                private events: Events,
                private globals: Globals,
                private session: SessionProvider,
                private platform: Platform,
                private config: Config,
                public instrumentData: InstrumentProvider,
                public eventProvider: EventProvider,
                public roleProvider: RoleProvider) {

        try {
            this.listenToLoginEvents();
            this.session.checkLogin();
            this.rootPage = (this.session.user && this.session.isLoggedIn ? TabsPage : LoginPage);
        }
        catch (exception) {
            console.error('COGIC APP ERROR:', exception);
        }

        this.roleProvider.getAll(null, false).then((roles) => {
            try {
                if (roles) {
                    this.globals.roles = roles;
                }
            }
            catch (exception) {
                console.error('COGIC APP ERROR:', exception);
            }
        });
    }

    listenToLoginEvents() {
        this.events.subscribe('session:login', () => {
            try {
                this.rootPage = TabsPage;
                this.instrumentData.getAll(null, false);
            }
            catch (exception) {
                console.error('COGIC APP ERROR:', exception);
            }
        });
        this.events.subscribe('session:logout', () => {
            this.rootPage = LoginPage;
        });
    }

    ngOnInit() {
        // Establish theme styles.
        //
        try {
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            let style = head.getElementsByTagName('style')[0];
            link.href = this.config.css;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.insertBefore(link, style);
        }
        catch (exception) {
            console.error('COGIC APP ERROR:', exception);
        }
    }
}