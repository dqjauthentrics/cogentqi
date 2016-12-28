import {Component} from "@angular/core";
import {ReportOutcomeTrends} from "./outcome-trends";
import {ReportResourceEfficacy} from "./resource-efficacy";
import {ReportResourceAnalysis} from "./resource-analysis";
import {PageMenuItem} from "../../components/page-menu";

@Component({
    templateUrl: 'index.html'
})
export class ReportsPage {
    public items: Array<PageMenuItem> = [
        {
            page: ReportResourceAnalysis,
            icon: 'bar-chart',
            name: 'Resource Analysis',
            description: 'An intelligent analysis of the resource base that identifies gaps, and relative competency coverage levels.'
        },
        {
            page: ReportResourceEfficacy,
            icon: 'line-chart',
            name: 'Resource Efficacy',
            description: 'Comparison of before/after competencies to identify whether resources are providing value (or not).',
        },
        {
            page: ReportOutcomeTrends,
            icon: 'line-chart',
            name: 'Outcome Trends',
            description: 'Trends in various outcome or KPI data metrics over the past year.',
        }
    ];
}
