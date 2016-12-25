import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../../providers/globals";
import {OutcomeProvider} from "../../../providers/outcome";

declare let Quill: any;

@Component({
    templateUrl: 'config.html',
})
export class OutcomeConfigPage {
    public outcome: any;
    public outDescripEditor: any;

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, private outcomeData: OutcomeProvider) {
        let comp = this;
        this.outcome = this.navParams.data;
        outcomeData.getSingle(this.outcome.id).then(outcome => {
            comp.outcome = outcome;
            comp.outcome.valid = true;
        });
    }

    ngAfterViewInit() {
        this.outDescripEditor = new Quill('#outDescripEditor', {
            theme: 'snow'
        });
    }

    save(resource) {
        this.globals.alertWarning('TODO: Save Outcome');
    }

    remove(resource) {
        let comp = this;
        this.globals.confirm('Are you sure you wish to remove this outcome permanently?', function () {
            comp.globals.alertWarning('TODO: Remove Outcome');
        });
    }
}