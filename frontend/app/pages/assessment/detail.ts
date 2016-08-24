import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {InstrumentProvider} from "../../providers/instrument";
import {Rubric} from "./rubric";

@Component({
    templateUrl: 'build/pages/assessment/detail.html',
    directives: [Rubric]
})
export class AssessmentDetailPage {
    slideIndex: number = 0;
    @ViewChild('assessmentSlider') slider: Slides;

    instrument: any = {};
    assessment: any = {};

    constructor(private nav: NavController, private navParams: NavParams, private assessmentData: AssessmentProvider, private instrumentData: InstrumentProvider) {
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(assessment => {
            console.log(assessment);
            this.assessment = assessment;
            instrumentData.getSingle(this.assessment.instrument.id).then(instrument => {
                this.instrument = instrument;
                for (let i = 0; i < this.instrument.questions.length; i++) {
                    let id = this.instrument.questions[i].id;
                    console.log('id', id);
                    this.instrument.questions[i].response = this.assessment.responses[id].rdx;
                    console.log('fff', this.assessment.responses[id]);
                }
            });
        });
    }

    save() {
        let instrument = this.instrument;
        if (instrument.questions) {
            let data = {memberId: this.assessment.mid, id: this.assessment.id, responses: []};
            for (let i = 0; i < instrument.questions.length; i++) {
                let id = instrument.questions[i].id;
                data.responses.push([instrument.questions[i].id, instrument.questions[i].response]);
            }
            console.log('data', data);
            this.assessmentData.update(data);
        }
    }

    pdf() {
        alert('pdf');
    }

    lock() {
        alert('lock');
    }

    goTo(slideIndex) {
        console.log('goto', slideIndex);
        this.slideIndex = slideIndex;
        this.slider.slideTo(slideIndex, 300);
    }

    swipeEvent(event) {
        if (event.direction == 4) { // left-to-right
            let currentIndex = this.slider.getActiveIndex();
            if (currentIndex == 0) {
                let lastIndex = this.slider.length() - 1;
                this.slider.slideTo(lastIndex, 300);
                this.slideIndex = lastIndex;
            }
        }
    }

    sliderStyle(choices) {
        let width = '80%;';
        if (choices) {
            width = (100 - (choices.length / 100)) + '%';
        }
        let style = 'width:' + width + '; margin:0 auto;';
        console.log('style:' + style);
        return style;
    }

}
