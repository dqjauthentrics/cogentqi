import {SessionProvider} from "../../providers/session";
import {Config} from "../../providers/config";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ResourceListPage} from "../resource/list";
import {MatrixPage} from "../matrix/matrix";

@Component({
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    user: any = null;
    matrix: MatrixPage;
    resources: ResourceListPage;

    constructor(public config: Config, private nav: NavController, private navParams: NavParams, public session: SessionProvider) {
        this.user = session.user;
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
