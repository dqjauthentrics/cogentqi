import {CogicApp} from "./app.component";
import {NgModule} from "@angular/core";
import {APP_BASE_HREF} from "@angular/common";
import {IonicApp, IonicModule} from "ionic-angular";
import {ChartModule} from "ng2-chartjs2";
import {DataTableModule} from "angular2-datatable";
/**
 * Pipes
 **/
import {DataFilterPipe} from "../pipes/data-filter-pipe";
import {Ellipsify} from "../pipes/ellipsify";
import {FilterArrayPipe} from "../pipes/filter-array-pipe";
import {Icon} from "../pipes/icon";
import {Namify} from "../pipes/namify";
import {Replace} from "../pipes/strings";
import {Round} from "../pipes/round";
import {Translate} from "../pipes/translate";
import {Space2break} from "../pipes/space2break";
/**
 * Components
 **/
import {AppIconButton} from "../components/app-icon-button";
import {AppIcon} from "../components/app-icon";
import {Avatar} from "../components/avatar";
import {HeaderBar} from "../components/header-bar";
import {LoadingIndicator} from "../components/loading-indicator";
import {MicroBadge} from "../components/micro-badge";
import {InfoBadge} from "../components/info-badge";
/**
 * Pages
 **/
import {AccountPage} from "../pages/account/account";
import {AssessmentDetailPage} from "../pages/assessment/detail";
import {AssessmentListPage} from "../pages/assessment/list";
import {AssessmentItem} from "../pages/assessment/_item";
import {AssessmentProvider} from "../providers/assessment";
import {CfgEventsListPage} from "../pages/configuration/events/list";
import {CfgInstrumentsListPage} from "../pages/configuration/instruments/list";
import {CfgOutcomesListPage} from "../pages/configuration/outcomes/list";
import {CfgResourcesListPage} from "../pages/configuration/resources/list";
import {CfgScheduleListPage} from "../pages/configuration/schedule/list";
import {ColorProvider} from "../providers/color";
import {ConfigHelpIndex} from "../pages/configuration/help";
import {ConfigurationPage} from "../pages/configuration/configuration";
import {Config} from "../providers/config";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {EventConfigPage} from "../pages/configuration/events/config";
import {EventProvider} from "../providers/event";
import {Globals} from "../providers/globals";
import {HelpPage} from "../pages/help/help";
import {IconProvider} from "../providers/icon";
import {InstrumentConfigPage} from "../pages/configuration/instruments/config";
import {InstrumentDetailPage} from "../pages/instrument/detail";
import {InstrumentListPage} from "../pages/instrument/list";
import {InstrumentProvider} from "../providers/instrument";
import {LoginPage} from "../pages/login/login";
import {MatrixPage} from "../pages/matrix/matrix";
import {MemberDetailPage} from "../pages/member/detail";
import {MemberListPage} from "../pages/member/list";
import {MemberProvider} from "../providers/member";
import {OutcomeConfigPage} from "../pages/configuration/outcomes/config";
import {OutcomeProvider} from "../providers/outcome";
import {ResourceConfigPage} from "../pages/configuration/resources/config";
import {ResourceDetailPage} from "../pages/resource/detail";
import {ResourceListPage} from "../pages/resource/list";
import {ResourceProvider} from "../providers/resource";
import {Rubric} from "../pages/assessment/rubric";
import {ScheduleConfigPage} from "../pages/configuration/schedule/config";
import {ScheduleProvider} from "../providers/schedule";
import {SessionProvider} from "../providers/session";
import {SettingsConfigPage} from "../pages/configuration/settings/config";
import {TabsPage} from "../pages/tabs/tabs";

/**
 export const deepLinkConfig: DeepLinkConfig = {
    links: [
        {segment: '', component: DashboardPage, name: 'DashboardPage'},
        {segment: '', component: MemberListPage, name: 'MemberListPage'},
        {segment: '', component: ResourceListPage, name: 'ResourceListPage'},
        {segment: '', component: ConfigurationPage, name: 'ConfigurationPage'},
    ]
};
 **/

@NgModule({
    declarations: [
        CogicApp,
        AccountPage,
        AppIcon,
        AppIconButton,
        AssessmentDetailPage,
        AssessmentListPage,
        AssessmentItem,
        Avatar,
        CfgEventsListPage,
        CfgScheduleListPage,
        CfgInstrumentsListPage,
        CfgOutcomesListPage,
        CfgResourcesListPage,
        ConfigHelpIndex,
        ConfigurationPage,
        DashboardPage,
        Ellipsify,
        EventConfigPage,
        FilterArrayPipe,
        HeaderBar,
        HelpPage,
        Icon,
        InstrumentConfigPage,
        InstrumentDetailPage,
        InstrumentListPage,
        LoadingIndicator,
        LoginPage,
        MatrixPage,
        MemberDetailPage,
        MemberListPage,
        MicroBadge,
        InfoBadge,
        Namify,
        DataFilterPipe,
        OutcomeConfigPage,
        Replace,
        ResourceConfigPage,
        ResourceDetailPage,
        ResourceListPage,
        Round,
        Rubric,
        ScheduleConfigPage,
        SettingsConfigPage,
        Space2break,
        TabsPage,
        Translate,
    ],
    imports: [
        IonicModule.forRoot(CogicApp),
        ChartModule,
        DataTableModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        CogicApp,
        AccountPage,
        AppIcon,
        AppIconButton,
        AssessmentDetailPage,
        AssessmentListPage,
        AssessmentItem,
        Avatar,
        CfgEventsListPage,
        CfgScheduleListPage,
        CfgInstrumentsListPage,
        CfgOutcomesListPage,
        CfgResourcesListPage,
        ConfigHelpIndex,
        ConfigurationPage,
        DashboardPage,
        EventConfigPage,
        HeaderBar,
        HelpPage,
        InstrumentConfigPage,
        InstrumentDetailPage,
        InstrumentListPage,
        LoginPage,
        MicroBadge,
        InfoBadge,
        MatrixPage,
        MemberDetailPage,
        MemberListPage,
        OutcomeConfigPage,
        ResourceConfigPage,
        ResourceDetailPage,
        ResourceListPage,
        Rubric,
        ScheduleConfigPage,
        SettingsConfigPage,
        TabsPage,
    ],
    providers: [
        Avatar,
        Translate,
        AppIcon,
        AppIconButton,
        LoadingIndicator,
        Config,
        Globals,
        ColorProvider,
        IconProvider,
        InstrumentProvider,
        MemberProvider,
        Namify,
        Space2break,
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
