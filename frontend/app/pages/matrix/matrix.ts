import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {UserProvider} from "../../providers/user";
import {InstrumentProvider} from "../../providers/instrument";
import {MemberProvider} from "../../providers/member";
import {MemberDetailPage} from "../member/detail";
import {AssessmentDetailPage} from "../assessment/detail";

@Component({
    templateUrl: 'build/pages/matrix/matrix.html',
})
export class MatrixPage {
    public matrix = {};
    public instrument = {id: null, n: '', questionGroups: []};
    public organizationId: number;
    public instrumentId: number;

    constructor(private nav: NavController, private user: UserProvider, private assessmentData: AssessmentProvider,
                private instrumentData: InstrumentProvider, private memberData: MemberProvider) {
        this.organizationId = user.orgId;
        this.checkInstruments();
    }

    checkInstruments() {
        if (this.instrumentData.list) {
            this.instrument = this.instrumentData.list[0];
            this.loadMatrix(this.instrument.id);
        }
    }

    loadMatrix(instrumentId) {
        if (this.instrument && this.instrument.id != this.instrumentId) {
            this.assessmentData.loadMatrix(this.organizationId, this.instrument.id).then(matrix => {
                this.matrix = matrix;
                this.instrumentId = this.instrument.id;
                this.instrumentData.currentSectionIdx = this.instrumentData.SECTION_ALL;
            });
        }
    }

    changeInstrument(id) {
        let tmp = this.instrumentData.find(id);
        if (tmp) {
            this.instrument = tmp;
            this.loadMatrix(this.instrument.id);
        }
    }

    showCell(response) {
        if (response) {
            if (this.instrumentData.currentSectionIdx == this.instrumentData.SECTION_SUMMARY) {
                return response[0] == 'S' || response[0] == 'CS';
            }
            else {
                return this.instrumentData.currentSectionIdx < 0 || this.instrumentData.currentSectionIdx == response[3];
            }
        }
        return false;
    }

    goToGroup(groupIndex: number) {
        this.instrumentData.currentSectionIdx = groupIndex;
    }

    goToMember(id: number) {
        console.log('looking for member: ', id);
        this.memberData.getSingle(id).then(member => {
            console.log('going to member: ', member);
            this.nav.push(MemberDetailPage, member);
        });
    }

    goToAssessment(id: number) {
        console.log('looking for assessment: ', id);
        this.assessmentData.getSingle(id).then(assessment => {
            console.log('going to assessment: ', assessment);
            this.nav.push(AssessmentDetailPage, assessment);
        });
    }

    goToOrganization(id: number) {
        this.organizationId = id;
        this.instrumentId = null;
        this.loadMatrix(this.instrument.id);
    }

    getScoreClass(response) {
        var cClass = '';
        try {
            var cellType = response[0];
            var value = Math.round(response[1]);
            var responseType = response[2];
            var section = response[3];
            var stylePrefix = response[4];
            if (!stylePrefix) {
                stylePrefix = 'levelBg';
            }
            switch (responseType) {
                case 'L': // LIKERT
                    cClass = 'matrixCircle ' + stylePrefix + value;
                    break;
                case 'Y': // YESNO
                    cClass = 'matrixCircle ' + stylePrefix + value;
                    break;
            }
        }
        catch (exception) {
            console.log(exception);
        }
        return cClass;
    }

    getCellClass(response) {
        var cClass = ' type' + response[0];
        cClass += ' section' + response[3];
        return cClass;
    }
}
