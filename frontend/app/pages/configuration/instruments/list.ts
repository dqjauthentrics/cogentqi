import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {InstrumentProvider} from "../../../providers/instrument";
import {InstrumentConfigPage} from "./config";

@Component({
    templateUrl: 'build/pages/configuration/instruments/list.html'
})
export class CfgInstrumentsListPage {
    instruments = [];

    constructor(private nav: NavController, instrumentData: InstrumentProvider) {
        instrumentData.getAll(null).then(instruments => {
            this.instruments = instruments;
        });
    }

    configureInstrument(instrument) {
        this.nav.push(InstrumentConfigPage, instrument);
    }
}


