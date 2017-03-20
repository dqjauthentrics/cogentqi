import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {MemberProvider} from "../../providers/member";
import {Graph} from "../../providers/graph";
import {InstrumentProvider} from "../../providers/instrument";
import {AssessmentProvider} from "../../providers/assessment";

declare let Highcharts;

@Component({
    templateUrl: 'competency-history.html'
})

export class MemberCompetencyHistoryPage {
    public member: any;
    public instrument: any;

    constructor(private nav: NavController, private navParams: NavParams, private memberData: MemberProvider,
                public globals: Globals, public instrumentData: InstrumentProvider, public assessmentProvider: AssessmentProvider, private graph: Graph) {
        this.member = this.navParams.data;

        if (this.instrumentData.list) {
            this.setCurrentInstrument(this.instrumentData.list[0].id);
        }
    }

    setCurrentInstrument(instrumentId) {
        let comp = this;
        if (instrumentId && this.instrumentData.list && this.member) {
            comp.instrument = this.globals.findObjectById(this.instrumentData.list, instrumentId);
            this.assessmentProvider.retrieveByMember(this.member.id, 3).then(
                (assessments: any) => {
                    if (assessments) {
                        let maxY = comp.instrument.max_range;
                        if (!maxY) {
                            maxY = 5;
                        }
                        for (let z = 0; z < comp.instrument.questionGroups.length; z++) {
                            let series = [];
                            let xLabels = [];
                            let questionGroup = comp.instrument.questionGroups[z];
                            let start = Math.min(assessments.length - 1, 2);
                            for (let i = start; i >= 0; i--) {
                                let assessment = assessments[i];
                                let dataSet = [];
                                for (let j = 0; j < questionGroup.questions.length; j++) {
                                    let question = questionGroup.questions[j];
                                    if (i == 0) {
                                        xLabels.push(question.name);
                                    }
                                    let response = assessment.responses[question.id];
                                    dataSet.push({label: question.name, y: parseInt(response.responseIndex)});
                                }
                                series.push({id: i, type: 'column', name: assessment.lastModified.substr(0, 10), data: dataSet});
                            }
                            let options = this.graph.columnGraphConfig(questionGroup.name, '', '', 'Ranking', maxY, xLabels, series);
                            let el = document.getElementById('competency-hx-' + z);
                            Highcharts.chart(el, options);
                        }
                    }
                });
        }
    };

    goToMember(member) {
        this.nav.pop();
    }
}
