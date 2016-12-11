import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {InstrumentProvider} from "../../providers/instrument";
import {InstrumentDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";

@Component({
    templateUrl: 'list.html'
})
export class InstrumentListPage {
    instruments = [];
    queryText: string = '';

    constructor(private nav: NavController, instrumentData: InstrumentProvider) {
        var organizationId = 2;
        var args = [organizationId];
        instrumentData.getAll(DataModel.buildArgs(args), false).then(instruments => {
            this.instruments = instruments;
            for (var instrument of this.instruments) {
                instrument.visible = true;
            }
        });
    }

    goToDetail(instrument) {
        this.nav.push(InstrumentDetailPage, instrument);
    }

}
