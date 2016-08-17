import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {UserProvider} from "../../providers/user";
import {InstrumentProvider} from "../../providers/instrument";
import {MemberDetailPage} from "../member/detail";

@Component({
    templateUrl: 'build/pages/matrix/matrix.html',
})
export class MatrixPage {
    public matrix = {};
    public instrument = {n: '', questionGroups: []};
    public instrumentData: InstrumentProvider;
    public instrumentId: number;
    public organizationId: number;

    constructor(private nav: NavController, private user: UserProvider, private assessmentData: AssessmentProvider, instrumentData: InstrumentProvider) {
        /** @todo These need to be arguments */
        this.organizationId = user.orgId;
        this.instrumentId = 5;
        this.instrumentData = instrumentData;

        assessmentData.loadMatrix(this.organizationId, this.instrumentId).then(matrix => {
            console.log("Retrieved matrix: ", matrix);
            this.matrix = matrix;
            this.loadInstruments();
        });
    }

    loadInstruments() {
        this.instrumentData.loadAll(null).then(instrument => {
            this.instrument = this.instrumentData.find(this.instrumentId);
        })
    }

    goToGroup(groupIndex: number) {

    }

    goToMember(id: number) {
        this.nav.push(MemberDetailPage);
    }

    goToAssessment(id: number) {
        this.nav.push(MemberDetailPage);
    }

    goToOrganization(id: number) {
        this.nav.push(MemberDetailPage);
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
