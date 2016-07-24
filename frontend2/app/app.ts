import {Component, ViewChild, Provider} from "@angular/core";
import {Events, ionicBootstrap, MenuController, Nav, Platform} from "ionic-angular";
import {Splashscreen, StatusBar} from "ionic-native";
import {AccountPage} from "./pages/account/account";
import {MemberData} from "./providers/member";
import {ResourceData} from "./providers/resource";
import {LoginPage} from "./pages/login/login";
import {SignupPage} from "./pages/signup/signup";
import {TabsPage} from "./pages/tabs/tabs";
import {UserData} from "./providers/user";
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from "ng2-translate/ng2-translate";
import {ROUTER_PROVIDERS} from "@angular/router";
import {HTTP_PROVIDERS, Http} from "@angular/http";

interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
}

@Component({
    templateUrl: 'build/app.html',
    pipes: [TranslatePipe]
})
class CogicApp {
    translate: TranslateService;

    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPages: PageObj[] = [
        {title: 'Dashboard', component: TabsPage, index: 0, icon: 'pulse'},
        {title: 'Members', component: TabsPage, index: 1, icon: 'people'},
        {title: 'Resources', component: TabsPage, index: 2, icon: 'contacts'},
        {title: 'About', component: TabsPage, index: 3, icon: 'information-circle'},
    ];
    loggedInPages: PageObj[] = [
        {title: 'Account', component: AccountPage, icon: 'person'},
        {title: 'Logout', component: TabsPage, icon: 'log-out'}
    ];
    loggedOutPages: PageObj[] = [
        {title: 'Login', component: LoginPage, icon: 'log-in'},
        {title: 'Signup', component: SignupPage, icon: 'person-add'}
    ];
    rootPage: any = TabsPage;

    constructor(private events: Events,
                private userData: UserData,
                private menu: MenuController,
                platform: Platform,
                memberData: MemberData,
                resourceData: ResourceData,
                translate: TranslateService) {

        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === 'true');
        });
        this.translate = translate;
        this.translate.use('en');
        this.listenToLoginEvents();
    }

    openPage(page: PageObj) {
        // The nav component was found using @ViewChild(Nav)
        // Reset the nav to remove previous pages and only have this page.
        // We wouldn't want the back button to show in this scenario.
        console.log('PAGE:', page);
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
            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }

    enableMenu(loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }
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
        MemberData,
        ResourceData,
        UserData,
        new Provider(TranslateLoader, {
            useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
            deps: [Http]
        }),
        TranslateService
    ],
    {
        tabbarPlacement: 'bottom'
    });
