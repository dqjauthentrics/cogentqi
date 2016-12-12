import {Component, Input} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {MessageProvider} from "../../providers/message";
import {AssessmentDetailPage} from "../../pages/assessment/detail";

@Component({
    selector: 'member-contact-card',
    templateUrl: '_contact.html'
})

export class MemberContactCard {
    @Input() member: any;

    public dirty: boolean = false;

    constructor(private nav: NavController, private alertCtrl: AlertController, private message: MessageProvider) {

    }

    canEdit() {
        return true;
    }

    goToAssessment(assessment) {
        this.nav.push(AssessmentDetailPage, {assessment:assessment});
    }

    sendEmail(member) {
        window.location.href = 'mailto:' + member.email;
    }

    sendTextPrompt(member: any) {
        let prompt = this.alertCtrl.create({
            title: 'Send Message',
            message: 'Enter text to send in the message:',
            cssClass: 'info',
            inputs: [{name: 'message', placeholder: 'message'}],
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Send',
                    handler: data => {
                        this.message.send(member, data.message);
                    }
                }
            ]
        });
        prompt.present();
    }

    setItem() {
        this.dirty = true;
    }
}

