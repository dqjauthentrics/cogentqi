import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {MemberEventProvider} from "../../providers/member-event";
import {IconProvider} from "../../providers/icon";
import {SessionProvider} from "../../providers/session";
import {Globals} from "../../providers/globals";
import {Namify} from "../../pipes/namify";

@Component({
    templateUrl: 'list.html'
})
export class EventListPage {
    public memberEvents = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";
    public event: any;

    constructor(private nav: NavController, private navParams: NavParams, private session: SessionProvider, private namifier: Namify, private globals: Globals, private memberEventProvider: MemberEventProvider, public icon: IconProvider) {
        if (navParams.data && navParams.data.id) {
            this.event = navParams.data;
        }
        this.loading = true;
        memberEventProvider.forOrganization(this.session.user.organizationId, this.event? this.event.id : 0).then((memberEvents: any) => {
            this.memberEvents = memberEvents;
            if (this.memberEvents) {
                for (let memberEvent of this.memberEvents) {
                    memberEvent.globals = globals;
                    memberEvent.namifier = namifier;
                }
            }
            this.loading = false;
        });
    }

    sortOccurred(memberEvent) {
        return memberEvent.occurred;
    }

    sortName(memberEvent) {
        return memberEvent.globals.appEvents[memberEvent.eventId]['name'];
    }

    sortCategory(memberEvent) {
        return memberEvent.globals.appEvents[memberEvent.eventId]['category'];
    }

    sortMember(memberEvent) {
        let name = '';
        if (memberEvent.member) {
            name = memberEvent.namifier.transform(memberEvent.member, false);
        }
        return name;
    }

    eventInfo(memberEvent, field) {
        return memberEvent.globals.appEvents[memberEvent.eventId][field];
    }
}
