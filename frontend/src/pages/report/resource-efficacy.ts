import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Globals} from "../../providers/globals";
import {Graph} from "../../providers/graph";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";
import {ResourceProvider} from "../../providers/resource";
import {Ellipsify} from "../../pipes/ellipsify";

declare let Highcharts;

@Component({
    templateUrl: 'resource-efficacy.html',
})
export class ReportResourceEfficacy {
    data: any;
    currentGraphIndex: number = 0;
    currentGraph = null;
    nextGraph = null;
    previousGraph = null;
    numberOfGraphs: number = 0;
    graphs = [];
    readyCount: number = 0;

    constructor(private nav: NavController, private globals: Globals, private session: SessionProvider, public icon: IconProvider,
                public resourceProvider: ResourceProvider, public graph: Graph) {
    }

    ngOnInit() {
        let comp = this;
        this.resourceProvider.getData('/efficacy').then((data: any) => {
            comp.data = data;
            comp.renderCharts();
        });
    }

    renderChart(el, resource) {
        let ellipse = new Ellipsify();
        let series = [
            {
                name: 'Average Before',
                data: resource.priorResponseAverages
            },
            {
                name: 'Average After',
                data: resource.subsequentResponseAverages
            }
        ];
        let options = this.graph.columnGraphConfig(resource.name, ellipse.transform(resource.description, 120), '', 'Average Score', 5, resource.questionLabels, series);
        return Highcharts.chart(el, options);
    }

    divsReady() {
        this.readyCount++;
        if (this.data) {
            let i = 0;
            let ready = true;
            this.data.forEach(function (resource) {
                let id = 'resourceEfficacy' + i;
                let el = document.getElementById(id);
                i++;
                if (!el) {
                    ready = false;
                    return;
                }
            });
            return ready;
        }
        return false;
    }

    renderCharts() {
        let comp = this;
        let i = 0;
        let handle = window.setInterval(function () {
            if (comp.divsReady()) {
                window.clearInterval(handle);
                comp.data.forEach(function (resource) {
                    let el = document.getElementById('resourceEfficacy' + i);
                    let graph = comp.renderChart(el, resource);
                    comp.graphs.push(graph);
                    i++;
                });
                comp.numberOfGraphs = comp.graphs.length;
            }
            else if (comp.readyCount > 1000) {
                window.clearInterval(handle);
            }
        }, 100);
    }

    showGraphs() {
        return this.numberOfGraphs > 0;
    }

    setGraphs = function () {
        let nextIndex = (this.currentGraphIndex + 1) % this.numberOfGraphs;
        let previousIndex = (this.currentGraphIndex + this.numberOfGraphs - 1) % this.numberOfGraphs;
        this.currentGraph = this.graphs[this.currentGraphIndex];
        this.nextGraph = this.graphs[nextIndex];
        this.previousGraph = this.graphs[previousIndex];
    }

    gotoNextGraph() {
        this.currentGraphIndex = (this.currentGraphIndex + 1) % this.numberOfGraphs;
        this.setGraphs();
    }

    gotoPreviousGraph() {
        this.currentGraphIndex = (this.currentGraphIndex + this.numberOfGraphs - 1) % this.numberOfGraphs;
        this.setGraphs();
    }

    canNavigate() {
        return this.graphs.length > 1;
    }
}
