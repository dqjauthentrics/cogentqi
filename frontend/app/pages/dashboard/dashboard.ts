import {UserProvider} from "../../providers/user";
import {Config} from "../../providers/config";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberListPage} from "../member/list";
import {ResourceListPage} from "../resource/list";
import {MatrixPage} from "../matrix/matrix";

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
})
export class DashboardPage {
    matrix: MatrixPage;
    resources: ResourceListPage;

    constructor(private config: Config,
                private nav: NavController,
                private navParams: NavParams,
                private user: UserProvider
    ) {

    }

    goToPage(pageName) {
        let page: any = MatrixPage;
        switch (pageName) {
            case 'resources':
                page = ResourceListPage;
        }
        this.nav.push(page);
    }
}
