import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {MemberProvider} from "../../providers/member";
import {AssessmentDetailPage} from "../assessment/detail";
import {MemberProgressPage} from "./progress";
import {MemberCompetencyHistoryPage} from "./competency-history";
import {MemberNotesPage} from "./notes";

@Component({
    templateUrl: 'detail.html'
})
export class MemberDetailPage {
    public member: any;
    public dirty: boolean = false;
    public saving: boolean = false;

    constructor(private nav: NavController, private navParams: NavParams, private memberData: MemberProvider, public globals: Globals) {
        this.member = this.navParams.data;
        if (this.member) {
            memberData.getSingle(this.member.id).then(member => {
                this.member = member;
            });
        }
    }

    save(member) {
        this.saving = true;
        this.memberData.update(this.member, true).then(
            (success) => {
                this.saving = false;
                this.dirty = false;
            },
            (error) => {
                console.error(error);
                this.saving = false;
            });
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, assessment);
    }

    goToProgress(member) {
        this.nav.push(MemberProgressPage, member);
    }

    goToCompetencyHistory(member) {
        this.nav.push(MemberCompetencyHistoryPage, member);
    }

    goToNotes(member) {
        this.nav.push(MemberNotesPage, member);
    }

    setDirty() {
        this.dirty = true;
    }

    canEdit() {
        return true;
    }
}
