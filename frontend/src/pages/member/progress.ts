import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {MemberProvider} from "../../providers/member";
import {InstrumentProvider} from "../../providers/instrument";
import {AssessmentProvider} from "../../providers/assessment";

declare let Highcharts;

@Component({
    templateUrl: 'progress.html'
})
export class MemberProgressPage {
    public member: any;
    public instrument: any;
    public configs = [];

    constructor(private nav: NavController, private navParams: NavParams, private memberData: MemberProvider,
                public globals: Globals, public instrumentData: InstrumentProvider, public assessmentProvider: AssessmentProvider) {
        this.member = this.navParams.data;

        this.configs.push({
            title: {text: 'Learning vs Outcomes', x: -20},
            subtitle: {text: 'Evaluation', x: -20},
            chart: {type: 'line'},
            credits: {enabled: false},
            xAxis: {categories: []},
            yAxis: [
                {min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
                {min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
            ],
            legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
            plotOptions: {line: {dataLabels: {enabled: true}}},
            exporting: {enabled: true},
            series: []
        });
        this.configs.push({
            title: {text: 'Learning vs Competencies', x: -20},
            subtitle: {text: 'Evaluation', x: -20},
            chart: {type: 'line'},
            credits: {enabled: false},
            xAxis: {categories: []},
            yAxis: [
                {min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
                {min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
            ],
            legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
            plotOptions: {line: {dataLabels: {enabled: true}}},
            exporting: {enabled: true},
            series: []
        });
        if (this.instrumentData.list) {
            this.setCurrentInstrument(this.instrumentData.list[0].id);
        }
    }

    setCurrentInstrument(instrumentId) {
        if (instrumentId && this.instrumentData.list && this.member) {
            this.instrument = this.globals.findObjectById(this.instrumentData.list, instrumentId);
            this.assessmentProvider.retrieveIndividualProgressByMonth(this.member.id).then(
                (data: any) => {
                    if (data) {
                        for (let i = 0; i < data.series.length; i++) {
                            if (data.series[i].grouping === 0 || data.series[i].grouping === 2) {
                                this.configs[0].series.push(data.series[i]);
                            }
                            if (data.series[i].grouping === 1 || data.series[i].grouping === 2) {
                                data.series[i].visible = true;
                                this.configs[1].series.push(data.series[i]);
                            }
                            data.series[i].visible = true;
                        }
                        for (let i = 0; i < this.configs.length; i++) {
                            let el = document.getElementById('progress' + i);
                            this.configs[i].xAxis.categories = data.labels;
                            console.log(el, this.configs[i]);
                            Highcharts.chart(el, this.configs[i]);
                        }
                    }
                });
        }
    };

    goToMember(member) {
        this.nav.pop();
    }
}
