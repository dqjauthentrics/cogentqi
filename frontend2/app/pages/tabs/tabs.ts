import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {DashboardPage} from "../dashboard/dashboard";
import {helpPage} from "../help/help";
import {AssessmentListPage} from "../assessment/list";
import {ResourceListPage} from "../resource/list";
import {MemberListPage} from "../member/list";

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    dashboardRoot: any = DashboardPage;
    memberRoot: any = MemberListPage;
    resourceRoot: any = ResourceListPage;
    assessmentRoot: any = AssessmentListPage;
    helpRoot: any = helpPage;
    mySelectedIndex: number;

    constructor(navParams: NavParams) {
         this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
