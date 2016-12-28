import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {MessageProvider} from "../../providers/message";
import {AssessmentDetailPage} from "../../pages/assessment/detail";

@Component({
    selector: 'member-contact-card',
    templateUrl: '_contact.html'
})

export class MemberContactCard {
    @Output() dirty: EventEmitter<any> = new EventEmitter;
    @Input() member: any;

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

    setDirty() {
        this.dirty.emit(true);
    }
}

