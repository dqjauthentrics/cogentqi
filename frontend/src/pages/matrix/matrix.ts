import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {AssessmentProvider} from "../../providers/assessment";
import {SessionProvider} from "../../providers/session";
import {InstrumentProvider} from "../../providers/instrument";
import {MemberProvider} from "../../providers/member";
import {MemberDetailPage} from "../member/detail";
import {AssessmentDetailPage} from "../assessment/detail";

@Component({
    templateUrl: 'matrix.html',
})
export class MatrixPage {
    public user: any;
    public matrix: any;
    public instrument = {id: null, n: '', questionGroups: []};
    public organizationId: number;
    public instrumentId: number;
    public loading: boolean = true;
    public segments = [];

    constructor(private nav: NavController, private globals: Globals, public session: SessionProvider, private assessmentData: AssessmentProvider,
                public instrumentData: InstrumentProvider, private memberData: MemberProvider) {

        if (session.user) {
            this.organizationId = this.session.user.organizationId;
        }
    }

    ngOnInit() {
        this.checkInstruments();
    }

    checkInstruments() {
        let comp = this;
        this.instrumentData.getAll(null, false).then(() => {
            if (comp.instrumentData.list) {
                comp.instrument = comp.instrumentData.list[0];
                comp.loadMatrix(comp.instrument.id);
            }
        });
    }

    loadMatrix(instrumentId) {
        let comp = this;
        if (!comp.instrument || comp.instrument.id !== comp.instrumentId) {
            comp.assessmentData.loadMatrix(comp.organizationId, comp.instrument.id).then(matrix => {
                comp.matrix = matrix;
                comp.instrumentId = comp.instrument.id;
                comp.instrumentData.currentSectionIdx = comp.instrumentData.SECTION_ALL;
                comp.segments = [{text: 'All', value: comp.instrumentData.SECTION_ALL}];
                let idx = 0;
                if (comp.instrument.questionGroups) {
                    for (let questionGroup of comp.instrument.questionGroups) {
                        comp.segments.push({text: questionGroup.tag, value: idx});
                        idx++
                    }
                    comp.segments.push({text: 'Summary', value: comp.instrumentData.SECTION_SUMMARY});
                }
                comp.loading = false;
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
        this.memberData.getSingle(id).then(member => {
            this.nav.push(MemberDetailPage, member);
        });
    }

    goToAssessment(id: number) {
        this.assessmentData.getSingle(id).then(assessment => {
            this.nav.push(AssessmentDetailPage, assessment);
        });
    }

    goToOrganization(id: number) {
        this.organizationId = id;
        this.instrumentId = null;
        this.loadMatrix(this.instrument.id);
    }

    goToRow(mType, row) {
        if (mType == 'M' && row.aid && row.aid > 0) {
            this.goToAssessment(row.aid);
        }
        else if (mType == 'O' && row.oid && row.oid > 0) {
            this.goToOrganization(row.oid);
        }
    }

    getScoreClass(response) {
        var cClass = '';
        try {
            let value = Math.round(response[1]);
            let responseType = response[2];
            //let section = response[3];
            let stylePrefix = response[4];
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
