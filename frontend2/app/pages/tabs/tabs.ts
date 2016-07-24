import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {AboutPage} from "../about/about";
import {SchedulePage} from "../schedule/schedule";
import {SpeakerListPage} from "../speaker-list/speaker-list";
import {MemberListPage} from "../member/list";

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    // set the root pages for each tab
    tab1Root: any = SchedulePage;
    tab2Root: any = SpeakerListPage;
    memberRoot: any = MemberListPage;
    tab4Root: any = AboutPage;
    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
