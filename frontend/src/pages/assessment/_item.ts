import {Component, Input} from "@angular/core";
import {SessionProvider} from "../../providers/session";
import {AlertController, NavController} from "ionic-angular";

@Component({
    selector: 'assessment-item',
    templateUrl: '_item.html'
})

export class AssessmentItem {
    @Input() assessment: any;
    @Input() showMember: boolean = true;
    @Input() showIcon: boolean = true;

    constructor(private alertCtrl: AlertController, private nav: NavController, private session: SessionProvider) {
        console.log('assessment', this.assessment);
    }

}