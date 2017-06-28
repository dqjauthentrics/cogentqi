import {ViewChild, ElementRef, Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";
import {InstrumentProvider} from "../../providers/instrument";
import {ResourceProvider} from "../../providers/resource";
import {Graph} from "../../providers/graph";
import {Translate} from "../../pipes/translate";

declare let Highcharts;

@Component({
    templateUrl: 'resource-analysis.html',
})
export class ReportResourceAnalysis {
    @ViewChild('resourceAnalysis') canvas: ElementRef;
    options: any;
    chart: any;
    data: any;

    constructor(private nav: NavController, private globals: Globals, private session: SessionProvider, public icon: IconProvider,
                public resourceProvider: ResourceProvider, public instrumentProvider: InstrumentProvider, public graph: Graph, private translate: Translate) {
        let comp = this;
        let resources = [];
        let questionNames = [];
        this.resourceProvider.getAll(null, false).then((data: any) => {
            let resourceData = data;
            if (resourceData) {
                let questionGroups = this.instrumentProvider.list[0].questionGroups;
                if (questionGroups) {
                    let questionCount = 0;
                    let questionIdToIndex = {};
                    questionGroups.forEach(function (group) {
                        group.questions.forEach(function (question) {
                            questionIdToIndex[question.id] = questionCount;
                            questionCount++;
                            questionNames.push(question.name);
                        })
                    });
                    resourceData.forEach(function (resource) {
                        let weights = [];
                        for (let i = 0; i < questionCount; i++) {
                            weights.push(0);
                        }
                        if (resource.alignments) {
                            resource.alignments.forEach(function (alignment) {
                                let totalUtility = 0;
                                alignment.mapping.forEach(function (map) {
                                    totalUtility += map.utility;
                                });
                                weights[questionIdToIndex[alignment.questionId]] = totalUtility;
                            });
                            resources.push({name: resource.name, data: weights});
                        }
                    });
                    comp.data = {resources: resources, questionNames: questionNames};
                    comp.renderChart();
                }
                else {
                    console.error('INVALID DATA:', this.instrumentProvider.list[0]);
                }
            }
        });
    }

    renderChart() {
        if (this.data) {
            let options = {
                title: {
                    text: this.translate.transform('Resource Competency Coverage Analysis')
                },
                subtitle: {
                    text: this.translate.transform('resources available for each competency')
                },
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                colors: this.graph.regularColors,
                credits: {enabled: false},
                legend: {},
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                xAxis: {
                    categories: this.data.questionNames
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Average Score'
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: this.data.resources
            };
            this.chart = Highcharts.chart(this.canvas.nativeElement, options);
        }
    }
}
