import {SessionProvider} from "../../providers/session";
import {AssessmentProvider} from "../../providers/assessment";
import {Globals} from "../../providers/globals";
import {Config} from "../../providers/config";
import {Graph} from "../../providers/graph";
import {MemberEventProvider} from "../../providers/member-event";
import {OutcomeProvider} from "../../providers/outcome";
import {PlanItemProvider} from "../../providers/plan-item";
import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ResourceListPage} from "../resource/list";
import {MatrixPage} from "../matrix/matrix";
import {Translate} from "../../pipes/translate";
import {OutcomeListPage} from "../outcome/list";
import {AssessmentListPage} from "../assessment/list";
import {PlanItemsListPage} from "../plan-items/list";
import {EventListPage} from "../event/list";

declare let Highcharts;

@Component({
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    loadingEvents: boolean = true;
    loadingAssessments: boolean = true;
    loadingPlanItems: boolean = true;
    loadingEventTypes: boolean = true;
    user: any = null;
    matrix: MatrixPage;
    resources: ResourceListPage;
    translator: any;
    eventsData: any;
    assessmentsData: any;
    planItemData: any;
    eventTypesData: any;

    constructor(public config: Config, private nav: NavController, private navParams: NavParams,
                private outcomeProvider: OutcomeProvider, private graph: Graph, public session: SessionProvider,
                public memberEventProvider: MemberEventProvider, public assessmentProvider: AssessmentProvider,
                private globals: Globals, private planItemProvider: PlanItemProvider) {

        if (session.user) {
            this.user = session.user;
            this.translator = new Translate(this.config);
            outcomeProvider.init().then(() => {
                this.renderOutcomesGauge();

            });
            memberEventProvider.retrieveYear(this.user.organizationId).then((data) => {
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
            memberEventProvider.retrieveTypes(this.user.organizationId).then((data) => {
                this.eventTypesData = data;
                this.renderEventTypesPie();
            });
        }
    }

    goToOutcomes() {
        this.nav.push(OutcomeListPage);
    }

    goToAssessments() {
        this.nav.push(AssessmentListPage);
    }

    goToEvents() {
        this.nav.push(EventListPage);
    }

    goToMatrix() {
        this.nav.push(MatrixPage);
    }

    goToPlanItems() {
        this.nav.push(PlanItemsListPage);
    }


    ngOnInit() {
        this.renderAssessmentsGauge();
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
            let comp = this;
            let series = this.eventsData.series;
            for (let i=0; i<series.length; i++) {
                series[i].events = {
                    click: function (event) {
                        comp.eventTypeSelected(this, event);
                    }
                };
            }
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
                        text: this.translator.transform('No. Events')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: series
            };
            Highcharts.chart(document.getElementById('eventsChart'), options);
            this.loadingEvents = false;
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
                        text: this.translator.transform('No. Completions')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: this.planItemData.series
            };
            Highcharts.chart(document.getElementById('planItemsChart'), options);
            this.loadingPlanItems = false;
        }
    }

    eventTypeSelected(chart, event) {
        let id = event.point.eventId;
        if (id) {
            let eventData = {
                id: id,
                name: this.globals.appEvents[id]['name'],
                description: this.globals.appEvents[id]['description'],
                category: this.globals.appEvents[id]['category'],
            };
            this.nav.push(EventListPage, eventData);
        }
    }

    assessmentTypeSelected(chart, event) {
        let id = event.point.instrumentId;
        if (id) {
            let assessmentData = {
                instrumentId: id
            };
            this.nav.push(AssessmentListPage, assessmentData);
        }
    }

    renderEventTypesPie() {
        if (this.eventTypesData) {
            let comp = this;
            let options: any = this.graph.pieGraphConfig('', '', this.eventTypesData.series, false);
            options.plotOptions.pie.dataLabels = {enabled: false};
            options.series[0].events = {
                click: function (event) {
                    comp.eventTypeSelected(this, event);
                }
            };
            Highcharts.chart(document.getElementById('eventTypesPie'), options);
            this.loadingEventTypes = false;
        }
    }

    renderAssessmentsChart() {
        if (this.assessmentsData) {
            let comp = this;
            let series = this.assessmentsData.series;
            for (let i=0; i<series.length; i++) {
                series[i].events = {
                    click: function (event) {
                        comp.assessmentTypeSelected(this, event);
                    }
                };
            }
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
                        text: this.translator.transform('No. Assessments')
                    },
                    stackLabels: {
                        enabled: false
                    }
                },
                series: series
            };
            Highcharts.chart(document.getElementById('assessmentsChart'), options);
            this.loadingAssessments = false;
        }
    }

    renderAssessmentsGauge() {
        this.renderGauge('assessmentsGauge', 2.5, 0, 5, '');
    }

    renderOutcomesGauge() {
        this.renderGauge('outcomesGauge', this.outcomeProvider.averageLevel(), 0, 100, '');
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
