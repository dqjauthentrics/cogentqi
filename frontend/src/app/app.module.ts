import {CogicApp} from "./app.component";
import {NgModule} from "@angular/core";
import {APP_BASE_HREF} from "@angular/common";
import {IonicApp, IonicModule} from "ionic-angular";

/**
 * Modules
 */
import {ChartModule} from "ng2-chartjs2";
import {DataTableModule} from "angular2-datatable";
import {InlineEditorModule} from "ng2-inline-editor";
/**
 * Pipes
 **/
import {DataFilterPipe} from "../pipes/data-filter-pipe";
import {Ellipsify} from "../pipes/ellipsify";
import {FilterArrayPipe} from "../pipes/filter-array-pipe";
import {Icon} from "../pipes/icon";
import {Namify} from "../pipes/namify";
import {Phone} from "../pipes/phone";
import {Replace} from "../pipes/strings";
import {Round} from "../pipes/round";
import {Space2break} from "../pipes/space2break";
import {Translate} from "../pipes/translate";
/**
 * Components
 **/
import {AppIconButton} from "../components/app-icon-button";
import {AppIcon} from "../components/app-icon";
import {Avatar} from "../components/avatar";
import {EditorButtonBar} from "../components/editor-button-bar";
import {HeaderBar} from "../components/header-bar";
import {InfoBadge} from "../components/info-badge";
import {LoadingIndicator} from "../components/loading-indicator";
import {MicroBadgeCount} from "../components/micro-badge-count";
import {MicroBadge} from "../components/micro-badge";
/**
 * Providers
 **/
import {AssessmentProvider} from "../providers/assessment";
import {ColorProvider} from "../providers/color";
import {Config} from "../providers/config";
import {EventConfigPage} from "../pages/configuration/events/config";
import {EventProvider} from "../providers/event";
import {Globals} from "../providers/globals";
import {IconProvider} from "../providers/icon";
import {InstrumentProvider} from "../providers/instrument";
import {MemberProvider} from "../providers/member";
import {MessageProvider} from "../providers/message";
import {OutcomeProvider} from "../providers/outcome";
import {ResourceProvider} from "../providers/resource";
import {ScheduleProvider} from "../providers/schedule";
import {SessionProvider} from "../providers/session";
/**
 * Pages
 **/
import {AccountPage} from "../pages/account/account";
import {AssessmentDetailPage} from "../pages/assessment/detail";
import {AssessmentItem} from "../pages/assessment/_item";
import {AssessmentListPage} from "../pages/assessment/list";
import {CfgEventsListPage} from "../pages/configuration/events/list";
import {CfgInstrumentsListPage} from "../pages/configuration/instruments/list";
import {CfgOutcomesListPage} from "../pages/configuration/outcomes/list";
import {CfgResourcesListPage} from "../pages/configuration/resources/list";
import {CfgScheduleListPage} from "../pages/configuration/schedule/list";
import {ConfigHelpIndex} from "../pages/configuration/help";
import {ConfigurationPage} from "../pages/configuration/configuration";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {HelpPage} from "../pages/help/help";
import {InstrumentConfigPage} from "../pages/configuration/instruments/config";
import {InstrumentDetailPage} from "../pages/instrument/detail";
import {InstrumentListPage} from "../pages/instrument/list";
import {LoginPage} from "../pages/login/login";
import {MatrixPage} from "../pages/matrix/matrix";
import {MemberAssessmentsCard} from "../pages/member/_assessments";
import {MemberContactCard} from "../pages/member/_contact";
import {MemberDetailPage} from "../pages/member/detail";
import {MemberEventsCard} from "../pages/member/_events";
import {MemberListPage} from "../pages/member/list";
import {OutcomeConfigPage} from "../pages/configuration/outcomes/config";
import {ResourceConfigPage} from "../pages/configuration/resources/config";
import {ResourceDetailPage} from "../pages/resource/detail";
import {ResourceListPage} from "../pages/resource/list";
import {Rubric} from "../pages/assessment/rubric";
import {ScheduleConfigPage} from "../pages/configuration/schedule/config";
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
        EditorButtonBar,
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
        MemberContactCard,
        MemberListPage,
        MemberEventsCard,
        MemberAssessmentsCard,
        MicroBadge,
        MicroBadgeCount,
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
        Phone,
    ],
    imports: [
        IonicModule.forRoot(CogicApp),
        ChartModule,
        DataTableModule,
        InlineEditorModule,
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
        EditorButtonBar,
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
        MicroBadgeCount,
        InfoBadge,
        MatrixPage,
        MemberDetailPage,
        MemberContactCard,
        MemberEventsCard,
        MemberAssessmentsCard,
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
        {provide: APP_BASE_HREF, useValue: '/'},
        AppIcon,
        AppIconButton,
        AssessmentProvider,
        Avatar,
        ColorProvider,
        Config,
        EventProvider,
        Globals,
        IconProvider,
        InstrumentProvider,
        LoadingIndicator,
        MemberProvider,
        MessageProvider,
        Namify,
        OutcomeProvider,
        Phone,
        ResourceProvider,
        ScheduleProvider,
        SessionProvider,
        Space2break,
        Translate,
    ]
})
export class AppModule {
}
