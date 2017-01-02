import {CogicApp} from "./app.component";
import {NgModule} from "@angular/core";
import {APP_BASE_HREF} from "@angular/common";
import {IonicApp, IonicModule} from "ionic-angular";
/**
 * Modules
 */
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
import {AppIcon} from "../components/app-icon";
import {Avatar} from "../components/avatar";
import {EditorButtonBar} from "../components/editor-button-bar";
import {HeaderBar} from "../components/header-bar";
import {InfoBadge} from "../components/info-badge";
import {LoadingIndicator} from "../components/loading-indicator";
import {MemberList} from "../pages/member/_list";
import {MicroBadgeCount} from "../components/micro-badge-count";
import {MicroBadge} from "../components/micro-badge";
import {PageMenu} from "../components/page-menu";
import {PlanItemList} from "../pages/plan-items/_plan-item-list";

/**
 * Providers
 **/
import {AssessmentProvider} from "../providers/assessment";
import {Color} from "../providers/color";
import {ConfigurationProvider} from "../providers/configuration";
import {Config} from "../providers/config";
import {EventProvider} from "../providers/event";
import {Globals} from "../providers/globals";
import {Graph} from "../providers/graph";
import {IconProvider} from "../providers/icon";
import {InstrumentProvider} from "../providers/instrument";
import {MemberProvider} from "../providers/member";
import {MemberEventProvider} from "../providers/member-event";
import {MemberNoteProvider} from "../providers/member-note";
import {MessageProvider} from "../providers/message";
import {OrganizationProvider} from "../providers/organization";
import {OutcomeProvider} from "../providers/outcome";
import {PDF} from "../providers/pdf";
import {PlanItemProvider} from "../providers/plan-item";
import {ResourceProvider} from "../providers/resource";
import {RoleProvider} from "../providers/role";
import {ScheduleProvider} from "../providers/schedule";
import {SessionProvider} from "../providers/session";
/**
 * Pages
 **/
import {AppPage} from "../pages/app-page";
import {AccountPage} from "../pages/account/account";
import {AssessmentDetailPage} from "../pages/assessment/detail";
import {AssessmentItem} from "../pages/assessment/_item";
import {AssessmentListPage} from "../pages/assessment/list";
import {ConfigEventsListPage} from "../pages/configuration/events/list";
import {ConfigEventsPage} from "../pages/configuration/events/config";
import {ConfigInstrumentsListPage} from "../pages/configuration/instruments/list";
import {ConfigInstrumentsPage} from "../pages/configuration/instruments/config";
import {ConfigOutcomesListPage} from "../pages/configuration/outcomes/list";
import {ConfigOutcomesPage} from "../pages/configuration/outcomes/config";
import {ConfigResourcesListPage} from "../pages/configuration/resources/list";
import {ConfigResourcesPage} from "../pages/configuration/resources/config";
import {ConfigScheduleListPage} from "../pages/configuration/schedule/list";
import {ConfigSchedulesPage} from "../pages/configuration/schedule/config";
import {ConfigSettingsPage} from "../pages/configuration/settings/config";
import {ConfigurationPage} from "../pages/configuration/index";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {EventListPage} from "../pages/event/list";
import {InstrumentViewPage} from "../pages/instrument/view";
import {LoginPage} from "../pages/login/login";
import {MatrixPage} from "../pages/matrix/matrix";
import {MemberAssessmentsCard} from "../pages/member/_assessments";
import {MemberCompetencyHistoryPage} from "../pages/member/competency-history";
import {MemberContactCard} from "../pages/member/_contact";
import {MemberDetailPage} from "../pages/member/detail";
import {MemberEventsCard} from "../pages/member/_events";
import {MemberListPage} from "../pages/member/list";
import {MemberNotesPage} from "../pages/member/notes";
import {MemberProgressPage} from "../pages/member/progress";
import {OrganizationAssessments} from "../pages/assessment/_organization-assessments";
import {OrganizationDetailPage} from "../pages/organization/detail";
import {OrganizationListPage} from "../pages/organization/list";
import {OutcomeListPage} from "../pages/outcome/list";
import {PlanItemsListPage} from "../pages/plan-items/list";
import {ProfessionalPage} from "../pages/professional/index";
import {ReportOutcomeTrends} from "../pages/report/outcome-trends";
import {ReportResourceAnalysis} from "../pages/report/resource-analysis";
import {ReportResourceEfficacy} from "../pages/report/resource-efficacy";
import {ReportsPage} from "../pages/report/index";
import {ResourceDetailPage} from "../pages/resource/detail";
import {ResourceListPage} from "../pages/resource/list";
import {Rubric} from "../pages/assessment/rubric";
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
        AppPage,
        AccountPage,
        AppIcon,
        AssessmentDetailPage,
        AssessmentItem,
        AssessmentListPage,
        Avatar,
        ConfigEventsListPage,
        ConfigEventsPage,
        ConfigInstrumentsListPage,
        ConfigInstrumentsPage,
        ConfigOutcomesListPage,
        ConfigOutcomesPage,
        ConfigResourcesListPage,
        ConfigResourcesPage,
        ConfigScheduleListPage,
        ConfigSchedulesPage,
        ConfigSettingsPage,
        ConfigurationPage,
        DashboardPage,
        DataFilterPipe,
        EditorButtonBar,
        Ellipsify,
        EventListPage,
        FilterArrayPipe,
        HeaderBar,
        Icon,
        InfoBadge,
        InstrumentViewPage,
        LoadingIndicator,
        LoginPage,
        MatrixPage,
        MemberAssessmentsCard,
        MemberCompetencyHistoryPage,
        MemberContactCard,
        MemberDetailPage,
        MemberEventsCard,
        MemberList,
        MemberListPage,
        MemberNotesPage,
        MemberProgressPage,
        MicroBadge,
        MicroBadgeCount,
        Namify,
        OrganizationAssessments,
        OrganizationDetailPage,
        OrganizationListPage,
        OutcomeListPage,
        PlanItemsListPage,
        ProfessionalPage,
        PageMenu,
        Phone,
        PlanItemList,
        Replace,
        ReportOutcomeTrends,
        ReportResourceAnalysis,
        ReportResourceEfficacy,
        ReportsPage,
        ResourceDetailPage,
        ResourceListPage,
        Round,
        Rubric,
        Space2break,
        TabsPage,
        Translate,
    ],
    imports: [
        IonicModule.forRoot(CogicApp),
        DataTableModule,
        InlineEditorModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        CogicApp,
        AccountPage,
        AssessmentDetailPage,
        AssessmentItem,
        AssessmentListPage,
        ConfigEventsListPage,
        ConfigEventsPage,
        ConfigInstrumentsListPage,
        ConfigInstrumentsPage,
        ConfigOutcomesListPage,
        ConfigOutcomesPage,
        ConfigResourcesListPage,
        ConfigResourcesPage,
        ConfigScheduleListPage,
        ConfigSchedulesPage,
        ConfigSettingsPage,
        ConfigurationPage,
        DashboardPage,
        EventListPage,
        InstrumentViewPage,
        LoginPage,
        MatrixPage,
        MemberAssessmentsCard,
        MemberCompetencyHistoryPage,
        MemberContactCard,
        MemberDetailPage,
        MemberEventsCard,
        MemberList,
        MemberListPage,
        MemberNotesPage,
        MemberProgressPage,
        OrganizationAssessments,
        OrganizationDetailPage,
        OrganizationListPage,
        OutcomeListPage,
        PlanItemsListPage,
        ProfessionalPage,
        ReportOutcomeTrends,
        ReportResourceAnalysis,
        ReportResourceEfficacy,
        ReportsPage,
        ResourceDetailPage,
        ResourceListPage,
        Rubric,
        TabsPage,
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        AppIcon,
        AssessmentProvider,
        Avatar,
        Color,
        Config,
        ConfigurationProvider,
        EventProvider,
        Globals,
        Graph,
        IconProvider,
        InstrumentProvider,
        LoadingIndicator,
        MemberProvider,
        MemberEventProvider,
        MemberNoteProvider,
        MessageProvider,
        Namify,
        OrganizationProvider,
        OutcomeProvider,
        PDF,
        Phone,
        PlanItemProvider,
        ResourceProvider,
        RoleProvider,
        ScheduleProvider,
        SessionProvider,
        Space2break,
        Translate,
    ]
})
export class AppModule {
}
