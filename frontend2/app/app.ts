import {Component, ViewChild, Provider, PLATFORM_PIPES, PLATFORM_DIRECTIVES} from "@angular/core";
import {Events, ionicBootstrap, MenuController, Nav, Platform} from "ionic-angular";
import {Splashscreen, StatusBar} from "ionic-native";
import {ROUTER_PROVIDERS} from "@angular/router";
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {Config} from "./providers/config";
import {MemberProvider} from "./providers/member";
import {ResourceProvider} from "./providers/resource";
import {AssessmentProvider} from "./providers/assessment";
import {UserProvider} from "./providers/user";
import {LoginPage} from "./pages/login/login";
import {AccountPage} from "./pages/account/account";
import {TabsPage} from "./pages/tabs/tabs";
import {FilterArrayPipe} from './pipes/filter-array-pipe';
import {Namify} from "./pipes/namify";
import {Replace} from "./pipes/strings";
import {Icon} from "./pipes/icon";
import {Avatar} from "./directives/avatar";

import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe, MissingTranslationHandler} from "ng2-translate/ng2-translate";

/**
 * Page information.
 */
interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@Component({
    templateUrl: 'build/app.html',
})

class CogicApp {
    translate: TranslateService;

    // The root nav is a child of the root app component.  @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu.  The left menu only works after login; the login page disables it;
    appPages: PageObj[] = [];
    loggedInPages: PageObj[] = [
        {title: 'Dashboard', component: TabsPage, index: 0, icon: 'pulse'},
        {title: 'Members', component: TabsPage, index: 1, icon: 'people'},
        {title: 'Resources', component: TabsPage, index: 2, icon: 'contacts'},
        {title: 'help', component: TabsPage, index: 3, icon: 'information-circle'},
        {title: 'Account', component: AccountPage, icon: 'person'},
        {title: 'Logout', component: TabsPage, icon: 'log-out'}
    ];
    loggedOutPages: PageObj[] = [
        {title: 'Login', component: LoginPage, icon: 'log-in'},
    ];
    pages: PageObj[] = this.loggedOutPages;

    rootPage: any = LoginPage;

    config: Config;

    constructor(private events: Events,
                private userData: UserProvider,
                private menu: MenuController,
                platform: Platform,
                config: Config,
                memberData: MemberProvider,
                resourceData: ResourceProvider,
                translate: TranslateService) {

        this.config = config;

        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        this.translate = translate;
        this.translate.use('en');
        this.listenToLoginEvents();

        //this.userData.hasLoggedIn().then((hasLoggedIn) => {
        //    this.setPages(hasLoggedIn === 'true');
        //});
        this.setPages(this.userData.isLoggedIn);
    }

    openPage(page: PageObj) {
        // The nav component was found using @ViewChild(Nav)
        // Reset the nav to remove previous pages and only have this page.
        // We wouldn't want the back button to show in this scenario.
        if (page.index) {
            this.nav.setRoot(page.component, {tabIndex: page.index});
        }
        else {
            this.nav.setRoot(page.component);
        }

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.userData.logout();
                this.setPages(false);
            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.rootPage = TabsPage;
            this.setPages(true);
        });

        this.events.subscribe('user:logout', () => {
            this.rootPage = LoginPage;
            console.log('logout event received', this.userData);
            this.setPages(false);
            let loginPage: PageObj = {title: 'Login', component: LoginPage, icon: 'log-in'};
            this.openPage(loginPage);
        });
    }

    setPages(loggedIn) {
        this.rootPage = loggedIn ? TabsPage : LoginPage;
        this.pages = loggedIn ? this.loggedInPages : this.loggedOutPages;
    }
}


export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(key: string) {
        return key;
    }
}

/**
 * @todo This should be done in the Config object, but I can't figure out how to access the CogicApp values here.
 */
var translations = '/site/default/translations';
var hostname = window.location.hostname;
var parts = hostname.split('.');
if (parts.length >= 2 && parts[0]) {
    translations = '/site/' + parts[0] + '/translations';
}

// Pass the main App component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument, see the docs for
// more ways to configure your app:
// http://ionicframework.com/docs/v2/api/config/Config/
// Place the tabs on the bottom for all platforms
// See the theming docs for the default values:
// http://ionicframework.com/docs/v2/theming/platform-specific-styles/

ionicBootstrap(CogicApp,
    [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        new Provider(Window, {useValue: window}),
        new Provider(TranslateLoader, {
            useFactory: (http: Http) => new TranslateStaticLoader(http, translations, '.json'),
            deps: [Http]
        }),
        {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler},
        TranslateService,
        new Provider(PLATFORM_PIPES, {
            useValue: [
                TranslatePipe,
                Namify,
                Replace,
                Icon,
                FilterArrayPipe
            ],
            multi: true
        }),
        new Provider(PLATFORM_DIRECTIVES, {
            useValue: [
                Avatar
            ],
            multi: true
        }),
        Config,
        MemberProvider,
        ResourceProvider,
        AssessmentProvider,
        UserProvider
    ],
    {
        tabbarPlacement: 'bottom'
    }
)
;
