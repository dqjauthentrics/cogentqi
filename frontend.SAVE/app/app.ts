import {Component, ViewChild, Provider, PLATFORM_PIPES, PLATFORM_DIRECTIVES} from "@angular/core";
import {Events, ionicBootstrap, Nav, Platform} from "ionic-angular";
import {Splashscreen, StatusBar} from "ionic-native";
import {ROUTER_PROVIDERS} from "@angular/router";
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {Config} from "./providers/config";
import {GlobalsProvider} from "./providers/globals";
import {ColorProvider} from "./providers/color";
import {IconProvider} from "./providers/icon";
import {InstrumentProvider} from "./providers/instrument";
import {MemberProvider} from "./providers/member";
import {ResourceProvider} from "./providers/resource";
import {AssessmentProvider} from "./providers/assessment";
import {OutcomeProvider} from "./providers/outcome";
import {EventProvider} from "./providers/event";
import {ScheduleProvider} from "./providers/schedule";
import {SessionProvider} from "./providers/session";
import {LoginPage} from "./pages/login/login";
import {AccountPage} from "./pages/account/account";
import {TabsPage} from "./pages/tabs/tabs";
import {FilterArrayPipe} from "./pipes/filter-array-pipe";
import {Namify} from "./pipes/namify";
import {Ellipsify} from "./pipes/ellipsify";
import {Round} from "./pipes/round";
import {Replace} from "./pipes/strings";
import {Icon} from "./pipes/icon";
import {Avatar} from "./directives/avatar";
import {LoadingIndicator} from "./directives/loading-indicator";
import {AppIcon} from "./directives/app-icon";
import {AppIconButton} from "./directives/app-icon-button";
import {HeaderBar} from "./directives/header-bar";
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe, MissingTranslationHandler} from "ng2-translate/ng2-translate";

/**
 * Page information.
 */
interface PageObj {
    title: string;
    component: any;
    icon: string;
    index?: number;
    tabMode: string;
}

@Component({
    templateUrl: 'build/app.html',
})

class CogicApp {
    translate: TranslateService;

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

    constructor(private events: Events, private globals: GlobalsProvider, private session: SessionProvider, platform: Platform, private config: Config, private instrumentData: InstrumentProvider, translate: TranslateService) {
        // Call any initial plugins when ready
        platform.ready().then(() => {
            StatusBar.styleDefault();
            Splashscreen.hide();
        });

        this.translate = translate;
        this.translate.use('en');
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
                Ellipsify,
                Round,
                Replace,
                Icon,
                FilterArrayPipe
            ],
            multi: true
        }),
        new Provider(PLATFORM_DIRECTIVES, {
            useValue: [
                Avatar,
                AppIcon,
                AppIconButton,
                HeaderBar,
                LoadingIndicator
            ],
            multi: true
        }),
        Config,
        GlobalsProvider,
        ColorProvider,
        IconProvider,
        InstrumentProvider,
        MemberProvider,
        ResourceProvider,
        AssessmentProvider,
        SessionProvider,
        OutcomeProvider,
        ScheduleProvider,
        EventProvider
    ],
    {
        tabbarPlacement: 'bottom'
    }
)
;
