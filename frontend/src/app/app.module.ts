import {CogicApp} from "./app.component";
import {NgModule} from "@angular/core";
import {APP_BASE_HREF} from "@angular/common";
import {IonicApp, IonicModule} from "ionic-angular";
import {ChartModule} from "ng2-chartjs2";
import {Config} from "../providers/config";
import {IconProvider} from "../providers/icon";
import {GlobalsProvider} from "../providers/globals";
import {ColorProvider} from "../providers/color";
import {InstrumentProvider} from "../providers/instrument";
import {ScheduleProvider} from "../providers/schedule";
import {EventProvider} from "../providers/event";
import {MemberProvider} from "../providers/member";
import {ResourceProvider} from "../providers/resource";
import {AssessmentProvider} from "../providers/assessment";
import {OutcomeProvider} from "../providers/outcome";
import {SessionProvider} from "../providers/session";
import {FilterArrayPipe} from "../pipes/filter-array-pipe";
import {Namify} from "../pipes/namify";
import {Translate} from "../pipes/translate";
import {Ellipsify} from "../pipes/ellipsify";
import {Round} from "../pipes/round";
import {Replace} from "../pipes/strings";
import {Icon} from "../pipes/icon";
import {Avatar} from "../directives/avatar";
import {LoadingIndicator} from "../directives/loading-indicator";
import {AppIcon} from "../directives/app-icon";
import {AppIconButton} from "../directives/app-icon-button";
import {HeaderBar} from "../directives/header-bar";
import {LoginPage} from "../pages/login/login";
import {AccountPage} from "../pages/account/account";
import {TabsPage} from "../pages/tabs/tabs";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {MemberListPage} from "../pages/member/list";
import {MemberDetailPage} from "../pages/member/detail";
import {ResourceListPage} from "../pages/resource/list";
import {ResourceDetailPage} from "../pages/resource/detail";
import {AssessmentListPage} from "../pages/assessment/list";
import {AssessmentDetailPage} from "../pages/assessment/detail";
import {Rubric} from "../pages/assessment/rubric";
import {MatrixPage} from "../pages/matrix/matrix";
import {HelpPage} from "../pages/help/help";

@NgModule({
    declarations: [
        CogicApp,
        AppIcon,
        AppIconButton,
        Avatar,
        Ellipsify,
        FilterArrayPipe,
        HeaderBar,
        Icon,
        LoginPage,
        Namify,
        Translate,
        Replace,
        Round,
        AccountPage,
        TabsPage,
        DashboardPage,
        MemberListPage,
        MemberDetailPage,
        ResourceListPage,
        ResourceDetailPage,
        AssessmentListPage,
        AssessmentDetailPage,
        MatrixPage,
        HelpPage,
        Rubric,
        LoadingIndicator,
    ],
    imports: [
        IonicModule.forRoot(CogicApp),
        ChartModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        CogicApp,
        AppIcon,
        AppIconButton,
        Avatar,
        HeaderBar,
        LoginPage,
        AccountPage,
        TabsPage,
        DashboardPage,
        MemberListPage,
        MemberDetailPage,
        ResourceListPage,
        ResourceDetailPage,
        AssessmentListPage,
        AssessmentDetailPage,
        MatrixPage,
        HelpPage,
        Rubric,
    ],
    providers: [
        Avatar,
        Translate,
        AppIcon,
        AppIconButton,
        HeaderBar,
        LoadingIndicator,
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
        EventProvider,
        {provide: APP_BASE_HREF, useValue: '/'}
    ]
})
export class AppModule {
}
