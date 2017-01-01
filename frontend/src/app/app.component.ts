import {Component, ViewChild, enableProdMode} from "@angular/core";
import {Events, Nav, Platform, App} from "ionic-angular";
import {Config} from "../providers/config";
import {Globals} from "../providers/globals";
import {InstrumentProvider} from "../providers/instrument";
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

    constructor(private _app: App, private events: Events, private globals: Globals, private session: SessionProvider, platform: Platform, private config: Config,
                public instrumentData: InstrumentProvider, public eventProvider: EventProvider) {
        this.listenToLoginEvents();
        this.session.checkLogin();
        this.rootPage = (this.session.isLoggedIn ? TabsPage : LoginPage);
    }

    listenToLoginEvents() {
        this.events.subscribe('session:login', () => {
            this.rootPage = TabsPage;
            this.instrumentData.getAll(null, false);
            this.globals.tabMode = this.session.user.roleId === this.globals.APP_ROLE_PROFESSIONAL ? 'professional' : 'admin';
        });
        this.events.subscribe('session:logout', () => {
            this.rootPage = LoginPage;
        });
    }

    ngOnInit() {
        // Establish theme styles.
        //
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        let style = head.getElementsByTagName('style')[0];
        link.href = this.config.css;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.insertBefore(link, style);
    }
}