import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {InstrumentProvider} from "../../../providers/instrument";
import {InstrumentConfigPage} from "./config";

@Component({
    templateUrl: 'list.html'
})
export class CfgInstrumentsListPage {
    public instruments = [];
    public loading: boolean = false;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";

    constructor(private nav: NavController, instrumentData: InstrumentProvider) {
        let comp = this;
        this.loading = true;
        instrumentData.getAll(null, false).then(instruments => {
            comp.instruments = instruments;
            comp.loading = false;
        });
    }

    configureInstrument(instrument) {
        this.nav.push(InstrumentConfigPage, instrument);
    }
}


