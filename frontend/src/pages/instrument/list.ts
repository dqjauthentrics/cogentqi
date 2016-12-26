import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {InstrumentProvider} from "../../providers/instrument";
import {InstrumentDetailPage} from "./detail";
import {DataModel} from "../../providers/data-model";
import {IconProvider} from "../../providers/icon";

@Component({
    templateUrl: 'list.html'
})
export class InstrumentListPage {
    instruments = [];
    queryText: string = '';

    constructor(private nav: NavController, instrumentData: InstrumentProvider, public icon: IconProvider) {
        let organizationId = 2;
        let args = [organizationId];
        instrumentData.getAll(DataModel.buildArgs(args), false).then(instruments => {
            this.instruments = instruments;
            for (let instrument of this.instruments) {
                instrument.visible = true;
            }
        });
    }

    goToDetail(instrument) {
        this.nav.push(InstrumentDetailPage, instrument);
    }

}
