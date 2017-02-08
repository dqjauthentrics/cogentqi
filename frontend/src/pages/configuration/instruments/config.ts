import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Globals} from "../../../providers/globals";
import {InstrumentProvider} from "../../../providers/instrument";

declare let jQuery: any;

@Component({
    templateUrl: 'config.html'
})

export class ConfigInstrumentsPage {
    public instrument: any;
    public group: any = {tag: '', id: 0, number: ''};
    public question: any = {name: '', id: 0, number: ''};
    public segments = [];

    constructor(private nav: NavController, private navParams: NavParams, private globals: Globals, private instrumentProvider: InstrumentProvider) {
        let comp = this;
        this.instrument = this.navParams.data;
        instrumentProvider.getSingle(this.instrument.id).then(instrument => {
            comp.instrument = instrument;
            this.group = instrument.questionGroups[0];
            this.question = this.group.questions[0];
            console.log(this.question);
        });
    }

    goToGroup(group) {
        this.group = group;
        this.question = this.group.questions[0];
    }

    goToQuestion(question) {
        this.question = question;
    }

    ngAfterViewInit() {
        jQuery('.wysiwyg').trumbowyg({
            btns: [
                ['formatting'],
                'btnGrp-semantic',
                ['superscript', 'subscript'],
                ['foreColor', 'backColor'],
                ['link'],
                ['insertImage'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat'],
            ]
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