import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {InstrumentProvider} from "../../../providers/instrument";

@Component({
    templateUrl: 'config.html'
})

export class InstrumentConfigPage {
    instrument: any;
    content: any;

    constructor(private nav: NavController, private navParams: NavParams, instrumentData: InstrumentProvider, http: Http) {
        this.instrument = this.navParams.data;
        instrumentData.getSingle(this.instrument.id).then(instrument => {
            this.instrument = instrument;
        });
    }
}