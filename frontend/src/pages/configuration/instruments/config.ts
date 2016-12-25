import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../../providers/globals";
import {InstrumentProvider} from "../../../providers/instrument";

declare let Quill: any;

@Component({
    templateUrl: 'config.html'
})

export class InstrumentConfigPage {
    public instrument: any;
    public instDescripEditor: any;

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, private instrumentData: InstrumentProvider) {
        let comp = this;
        this.instrument = this.navParams.data;
        instrumentData.getSingle(this.instrument.id).then(instrument => {
            comp.instrument = instrument;
        });
    }

    ngAfterViewInit() {
        this.instDescripEditor = new Quill('#instDescripEditor', {
            theme: 'snow'
        });
    }

    save(resource) {
        this.globals.alertWarning('TODO: Save Instrument');
    }

    remove(resource) {
        let comp = this;
        this.globals.confirm('Are you sure you wish to remove this instrument permanently?', function () {
            comp.globals.alertWarning('TODO: Remove Instrument');
        });
    }
}