import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {MemberProvider} from "../../providers/member";
import {MemberDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";

@Component({
    templateUrl: 'build/pages/member/list.html'
})
export class MemberListPage {
    members = [];
    queryText: string = '';

    constructor(private nav: NavController, memberData: MemberProvider) {
        var organizationId = 2;
        var drilldown = 1;
        var includeInactive = 0;
        var args = [organizationId, drilldown, includeInactive];
        memberData.getAll(DataModel.buildArgs(args)).then(members => {
            this.members = members;
            for (var member of this.members) {
                member.visible = true;
            }
        });
    }

    goToDetail(member) {
        this.nav.push(MemberDetailPage, member);
    }

    filterer = function (member, filterText) {
        console.log('FILTER:', member, filterText);
        try {
           // for (var member of this.members) {
                filterText = filterText.toLowerCase();
                member.visible = filterText == null ||
                    member.fn.toLowerCase().indexOf(filterText) >= 0 ||
                    member.ln.toLowerCase().indexOf(filterText) >= 0 ||
                    (member.rn != undefined ? member.rn.toLowerCase().indexOf(filterText) >= 0 : false)
                ;
            //}
        }
        catch (exception) {
            console.log(exception);
        }
        return true;
    }


}
