import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {InstrumentProvider} from "../../providers/instrument";
import {Config} from "../../providers/config";

@Component({
    templateUrl: 'view.html'
})
export class InstrumentViewPage {
    instrument: any;

    constructor(private navParams: NavParams, public config: Config, public instrumentData: InstrumentProvider) {
        this.instrument = this.navParams.data;
        instrumentData.getSingle(this.instrument.id).then(instrument => {
            this.instrument = instrument;
        });
    }
}
