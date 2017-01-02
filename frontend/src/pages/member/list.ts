import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";
import {Config} from "../../providers/config";

@Component({
    templateUrl: 'list.html'
})
export class MemberListPage {
    organizationId: number;

    constructor(private nav: NavController, public session: SessionProvider, public config: Config, public memberData: MemberProvider, public icon: IconProvider) {
        this.organizationId = this.session.user.organizationId;
    }
}
