import {Component} from "@angular/core";
import {DomSanitizationService} from "@angular/platform-browser";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {InstrumentProvider} from "../../../providers/instrument";

@Component({
    templateUrl: 'build/pages/configuration/instruments/config.html'
})

export class InstrumentConfigPage {
    instrument: any;
    content: any;

    constructor(private nav: NavController, private navParams: NavParams, instrumentData: InstrumentProvider, http: Http, private sanitizer: DomSanitizationService) {
        var that = this;
        this.instrument = this.navParams.data;
        instrumentData.getSingle(this.instrument.id).then(instrument => {
            this.instrument = instrument;
        });
    }
}