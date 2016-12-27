import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";
import {ReportOutcomeTrends} from "./outcome-trends";
import {ReportResourceEfficacy} from "./resource-efficacy";
import {ReportResourceAnalysis} from "./resource-analysis";

@Component({
    templateUrl: 'index.html'
})
export class ReportsPage {
    public items = [
        {
            page: ReportResourceAnalysis,
            icon: 'bar-chart',
            title: 'Resource Analysis',
            description: 'An intelligent analysis of the resource base that identifies gaps, and relative competency coverage levels.'
        },
        {
            page: ReportResourceEfficacy,
            icon: 'line-chart',
            title: 'Resource Efficacy',
            description: 'Comparison of before/after competencies to identify whether resources are providing value (or not).',
        },
        {
            page: ReportOutcomeTrends,
            icon: 'line-chart',
            title: 'Outcome Trends',
            description: 'Trends in various outcome or KPI data metrics over the past year.',
        }
    ];

    constructor(private nav: NavController, private globals: Globals, private session: SessionProvider, public icon: IconProvider) {
    }

    goToReport(item) {
        this.nav.push(item.page);
    }
}
