import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {InstrumentProvider} from "../../providers/instrument";
import {ColorProvider} from "../../providers/color";

declare let jsPDF;
declare let html2canvas;

@Component({
    templateUrl: 'detail.html',
})
export class AssessmentDetailPage {
    slideIndex: number = 0;
    @ViewChild('assessmentSlider') slider: Slides;

    instrument: any = {};
    assessment: any = {};

    constructor(private color: ColorProvider, private nav: NavController, private navParams: NavParams, private assessmentData: AssessmentProvider, public instrumentData: InstrumentProvider) {
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(assessment => {
            console.log(assessment);
            this.assessment = assessment;
            this.instrument = instrumentData.find(this.assessment.instrument.id);
            if (this.instrument) {
                console.log("FOUND:", this.instrument);
                for (let i = 0; i < this.instrument.questions.length; i++) {
                    let id = this.instrument.questions[i].id;
                    this.instrument.questions[i].response = this.assessment.responses[id].responseIndex;
                }
            }
        });

    }

    save() {
        for (let i = 0; i < this.instrument.questions.length; i++) {
            let id = this.instrument.questions[i].id;
            this.assessment.responses[id].responseIndex = this.instrument.questions[i].response;
        }
        this.assessmentData.update(this.assessment);
    }

    pdf() {
        this.generateAssessmentDoc(this.instrument, this.assessment);
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

    safeName(name) {
        return name.replace(/\W/g, '_');
    }

    answer(question, responseIndex) {
        return question.type.choices[(responseIndex - 1)].name; //@todo: why isn't this zero relative?
    }

    generateAssessmentDoc(instrument, assessment) {
        let opts = {
            orientation: 'l',
            unit: 'mm',
            format: 'a3',
            compress: true,
            fontSize: 8,
            lineHeight: 1,
            autoSize: false,
            printHeaders: true
        };
        let doc = new jsPDF(opts, '', '', '');
        let html = '<html><body><h1>Assessment</h1>';
        let nGroups = instrument.questionGroups.length;
        for (let i = 0; i < nGroups; i++) {
            let questionGroup = instrument.questionGroups[i];
            html += '<div>' + questionGroup.tag + '</div>';
            for (let j = 0; j < questionGroup.questions.length; j++) {
                let question = questionGroup.questions[j];
                if (question) {
                    let response = assessment.responses[question.id];
                    html += '<div class="pdf-question">' + question.name + '<div></div>' + this.answer(question, response.responseIndex) + '</div>';
                }
            }
        }
        html += '</body></html>';
        doc.fromHTML(html);
        var assessmentFileName = 'Assessment_' + assessment.member.firstName + '_' + assessment.member.lastName + '_' + assessment.lastModified;
        assessmentFileName = this.safeName(assessmentFileName);
        doc.save(assessmentFileName);
    }
}
