import {Component} from "@angular/core";
import {NavParams} from "ionic-angular";
import {InstrumentProvider} from "../../providers/instrument";
import {Globals} from "../../providers/globals";
import {AssessmentProvider} from "../../providers/assessment";
import {SessionProvider} from "../../providers/session";
import {IconProvider} from "../../providers/icon";

@Component({
    templateUrl: 'list.html',
})

export class AssessmentListPage {
    public loading: boolean = false;
    public assessments = [];
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "orderedOn";
    public sortOrder = "desc";
    public instrument: any;

    constructor(private navParams: NavParams, private session: SessionProvider, private assessmentData: AssessmentProvider,
                public icon: IconProvider, private globals: Globals, private instrumentProvider: InstrumentProvider) {

        if (navParams.data && navParams.data.instrumentId) {
            this.instrument = globals.findObjectById(this.instrumentProvider.list, navParams.data.instrumentId);
        }
        this.loading = true;
        let comp = this;
        if (session.user) {
            let instrumentId = this.instrument? this.instrument.id : 0;
            let url = '/list/' + session.user.organizationId + '/' + instrumentId;
            console.log('url:', url);
            assessmentData.getData(url).then((assessments:any) => {
                comp.assessments = assessments;
                comp.loading = false;
            });
        }
    }

}
