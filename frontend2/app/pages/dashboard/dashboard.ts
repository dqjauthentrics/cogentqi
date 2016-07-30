import {UserProvider} from "../../providers/user";
import {Config} from "../../providers/config";
import {Replace} from "../../pipes/strings";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberListPage} from "../member/list";
import {ResourceListPage} from "../resource/list";
import {MatrixPage} from "../matrix/matrix";

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    pipes: [Replace]
})
export class DashboardPage {

    constructor(private config: Config,
                private nav: NavController,
                private navParams: NavParams,
                private user: UserProvider) {
    }

    goToPage() {
        this.nav.push(MatrixPage);
    }
}
