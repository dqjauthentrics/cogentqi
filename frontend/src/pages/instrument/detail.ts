import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {InstrumentProvider} from "../../providers/instrument";

@Component({
    templateUrl: 'detail.html'
})
export class InstrumentDetailPage {
    instrument: any;

    constructor(private nav: NavController, private navParams: NavParams, instrumentData: InstrumentProvider) {
        this.instrument = this.navParams.data;
        instrumentData.getSingle(this.instrument.id).then(instrument => {
            this.instrument = instrument;
        });
    }

    goToAssessment(assessment) {
        alert(assessment.instrument.name);
    }
}
