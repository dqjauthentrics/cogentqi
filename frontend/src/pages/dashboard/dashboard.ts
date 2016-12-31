import {SessionProvider} from "../../providers/session";
import {AssessmentProvider} from "../../providers/assessment";
import {Config} from "../../providers/config";
import {Graph} from "../../providers/graph";
import {EventProvider} from "../../providers/event";
import {PlanItemProvider} from "../../providers/plan-item";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ResourceListPage} from "../resource/list";
import {MatrixPage} from "../matrix/matrix";
import {Translate} from "../../pipes/translate";

declare let Highcharts;

@Component({
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    user: any = null;
    matrix: MatrixPage;
    resources: ResourceListPage;
    translator: any;
    eventsData: any;
    assessmentsData: any;
    planItemData: any;
    eventTypesData: any;

    constructor(public config: Config, private nav: NavController, private navParams: NavParams, private graph: Graph, public session: SessionProvider,
                public eventProvider: EventProvider, public assessmentProvider: AssessmentProvider, private planItemProvider: PlanItemProvider) {
        this.user = session.user;
        this.translator = new Translate(this.config);
        eventProvider.retrieveYear(this.user.organizationId).then((data) => {
            this.eventsData = data;
            this.renderEventsChart();
        });
        assessmentProvider.retrieveYear(this.user.organizationId).then((data) => {
            this.assessmentsData = data;
            this.renderAssessmentsChart();
        });
        planItemProvider.retrieveYear(this.user.organizationId, planItemProvider.STATUS_COMPLETED).then((data) => {
            this.planItemData = data;
            this.renderPlanItemsChart();
        });
        eventProvider.retrieveTypes(this.user.organizationId).then((data) => {
            this.eventTypesData = data;
            this.renderEventTypesPie();
        });
    }

    ngOnInit() {
        this.renderAssessmentsGauge();
        this.renderOutcomesGauge();
    }

    renderGauge(id, value, min, max, lbl) {
        let stop1 = max / 3;
        let stop2 = stop1 * 2;
        Highcharts.chart(document.getElementById(id), {
            chart: {
                type: 'gauge',
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: 'transparent'
            },
            credits: {enabled: false},
            title: {
                text: ''
            },
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [
                    {
                        backgroundColor: {
                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    },
                    {
                        backgroundColor: {
                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    },
                    {},
                    {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
            },
            yAxis: {
                min: min,
                max: max,
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: lbl
                },
                plotBands: [
                    {
                        from: min,
                        to: stop1,
                        color: '#DF5353'
                    },
                    {
                        from: stop1,
                        to: stop2,
                        color: '#DDDF0D'
                    },
                    {
                        from: stop2,
                        to: max,
                        color: '#55BF3B'
                    }]
            },
            series: [{
                name: 'Level',
                data: [value],
                tooltip: {
                    valueSuffix: ' Level'
                }
            }]

        });
    }

    renderEventsChart() {
        if (this.eventsData) {
            let options = {
                title: {text: ''},
                subtitle: {text: ''},
                chart: {type: 'column', backgroundColor: 'transparent'},
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
                legend: {enabled: false},
                xAxis: {categories: this.eventsData.labels},
                yAxis: {
                    min: 0,
                    title: {
                        text: this.translator.transform('Events')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: this.eventsData.series
            };
            Highcharts.chart(document.getElementById('eventsChart'), options);
        }
    }

    renderPlanItemsChart() {
        if (this.planItemData) {
            let options = {
                title: {text: this.translator.transform('')},
                subtitle: {text: ''},
                chart: {type: 'column', backgroundColor: 'transparent'},
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
                legend: {enabled: false},
                xAxis: {categories: this.planItemData.labels},
                yAxis: {
                    min: 0,
                    title: {
                        text: this.translator.transform('Completions')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: this.planItemData.series
            };
            Highcharts.chart(document.getElementById('planItemsChart'), options);
        }
    }

    renderEventTypesPie() {
        if (this.eventTypesData) {
            console.log('ppp', this.eventTypesData);
            let options:any = this.graph.pieGraphConfig('', '', this.eventTypesData.series, false);
            options.plotOptions.pie.dataLabels = {enabled:false};
            Highcharts.chart(document.getElementById('eventTypesPie'), options);
        }
    }

    renderAssessmentsChart() {
        if (this.assessmentsData) {
            let options = {
                title: {text: ''},
                subtitle: {text: ''},
                chart: {type: 'column', backgroundColor: 'transparent'},
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
                legend: {enabled: false},
                xAxis: {categories: this.assessmentsData.labels},
                yAxis: {
                    min: 0,
                    title: {
                        text: this.translator.transform('Assessments')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: this.assessmentsData.series
            };
            Highcharts.chart(document.getElementById('assessmentsChart'), options);
        }
    }

    renderAssessmentsGauge() {
        this.renderGauge('assessmentsGauge', 2.5, 0, 5, '');
    }

    renderOutcomesGauge() {
        this.renderGauge('outcomesGauge', 4.5, 0, 10, '');
    }

    goToPage(pageName) {
        let page: any = MatrixPage;
        switch (pageName) {
            case 'resources':
                page = ResourceListPage;
        }
        this.nav.push(page);
    }
}
