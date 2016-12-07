import {Component, ViewChild, enableProdMode} from "@angular/core";
import {Events, Nav, Platform} from "ionic-angular";
import {StatusBar} from "ionic-native";
import {Config} from "../providers/config";
import {GlobalsProvider} from "../providers/globals";
import {InstrumentProvider} from "../providers/instrument";
import {SessionProvider} from "../providers/session";
import {LoginPage} from "../pages/login/login";
import {AccountPage} from "../pages/account/account";
import {TabsPage} from "../pages/tabs/tabs";

if (GlobalsProvider.isProduction == true) {
    enableProdMode();
}

/**
 * Page information.
 */
export interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
    tabMode: string;
}

@Component({
    templateUrl: 'app.html'
})

export class CogicApp {
    // The root nav is a child of the root app component.  @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu.  The left menu only works after login; the login page disables it;
    accountPages: PageObj[] = [
        {title: 'Account', component: AccountPage, icon: 'person', tabMode: 'normal'},
        {title: 'Logout', component: TabsPage, icon: 'log-out', tabMode: 'normal'}
    ];
    configurationPages: PageObj[] = [
        {title: 'Schedule', component: TabsPage, index: 1, icon: 'schedule', tabMode: 'configuration'},
        {title: 'Resources', component: TabsPage, index: 2, icon: 'resources', tabMode: 'configuration'},
        {title: 'Events', component: TabsPage, index: 3, icon: 'events', tabMode: 'configuration'},
        {title: 'Outcomes', component: TabsPage, index: 4, icon: 'outcomes', tabMode: 'configuration'},
        {title: 'Instruments', component: TabsPage, index: 5, icon: 'instruments', tabMode: 'configuration'},
        {title: 'Weighting', component: TabsPage, index: 6, icon: 'weights', tabMode: 'configuration'},
    ];
    navigationPages: PageObj[] = [
        {title: 'Dashboard', component: TabsPage, index: 0, icon: 'pulse', tabMode: 'normal'},
        {title: 'Members', component: TabsPage, index: 1, icon: 'people', tabMode: 'normal'},
        {title: 'Resources', component: TabsPage, index: 2, icon: 'contacts', tabMode: 'normal'},
    ];
    loggedOutPages: PageObj[] = [
        {title: 'Login', component: LoginPage, icon: 'log-in', tabMode: 'normal'},
    ];
    pages: PageObj[] = this.loggedOutPages;

    rootPage: any = LoginPage;

    constructor(private events: Events, private globals: GlobalsProvider, private session: SessionProvider, platform: Platform, private config: Config, private instrumentData: InstrumentProvider) {
        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });

        //this.translate = translate;
        //this.translate.use('en');
        this.listenToLoginEvents();

        this.session.checkLogin();
        this.setPages(this.session.isLoggedIn);
    }

    openPage(page: PageObj) {
        this.session.checkLogin();
        // The nav component was found using @ViewChild(Nav)
        // Reset the nav to remove previous pages and only have this page.
        // We wouldn't want the back button to show in this scenario.
        if (page.tabMode) {
            this.globals.tabMode = page.tabMode;
        }
        else {
            this.globals.tabMode = 'normal';
        }
        if (page.index) {
            this.nav.setRoot(page.component, {tabIndex: page.index, tabMode: page.tabMode});
        }
        else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.session.logout();
                this.setPages(false);
            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.rootPage = TabsPage;
            this.setPages(true);
            this.instrumentData.loadAll(null);
        });
        this.events.subscribe('user:logout', () => {
            this.rootPage = LoginPage;
            this.setPages(false);
            let loginPage: PageObj = {title: 'Login', component: LoginPage, icon: 'log-in', tabMode: 'normal'};
            this.openPage(loginPage);
        });
    }

    setPages(loggedIn) {
        this.rootPage = loggedIn ? TabsPage : LoginPage;
        //this.pages = loggedIn ? this.loggedInPages : this.loggedOutPages;
    }
}