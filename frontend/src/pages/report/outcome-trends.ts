import {ViewChild, ElementRef, Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";
import {OutcomeProvider} from "../../providers/outcome";

declare let Highcharts;

@Component({
    templateUrl: 'outcome-trends.html',
})
export class ReportOutcomeTrends {
    @ViewChild('outcomes') canvas: ElementRef;
    options: any;
    chart: any;
    data: any;

    constructor(private nav: NavController, private globals: Globals, private session: SessionProvider, public icon: IconProvider, public outcomesProvider: OutcomeProvider) {
        if (session.user) {
            outcomesProvider.getTrends(session.user.organizationId).then((data: any) => {
                this.data = data;
                if (this.data) {
                    this.renderChart();
                }
            });
        }
    }

    renderChart() {
        this.chart = Highcharts.chart(this.canvas.nativeElement, {
            title: {text: 'Outcome Trends'},
            chart: {type: 'line'},
            credits: {enabled: false},
            legend: {},
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                categories: this.data.labels
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Level'
                },
                stackLabels: {
                    enabled: false
                }
            },
            series: this.data.series
        });
    }
}
