import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Slides} from "ionic-angular";
import {AssessmentProvider} from "../../providers/assessment";
import {InstrumentProvider} from "../../providers/instrument";
import {Globals} from "../../providers/globals";
import {ColorProvider} from "../../providers/color";
import {IconProvider} from "../../providers/icon";
import {Config} from "../../providers/config";
import {PDF} from "../../providers/pdf";
import {MemberDetailPage} from "../member/detail";

@Component({
    templateUrl: 'detail.html',
})
export class AssessmentDetailPage {
    @ViewChild('assessmentSlider') slider: Slides;

    public slideIndex: number = 0;
    public instrument: any = {};
    public assessment: any = {};
    public dirty: boolean = false;

    constructor(private color: ColorProvider, private nav: NavController, private navParams: NavParams, private config: Config,
                private assessmentData: AssessmentProvider, public icon: IconProvider, public instrumentData: InstrumentProvider, public pdf: PDF, public globals: Globals) {
        this.assessment = this.navParams.data;
        assessmentData.getSingle(this.assessment.id).then(assessment => {
            this.assessment = assessment;
            this.instrument = instrumentData.find(this.assessment.instrument.id);
            if (this.instrument) {
                for (let i = 0; i < this.instrument.questions.length; i++) {
                    let id = this.instrument.questions[i].id;
                    this.instrument.questions[i].response = this.assessment.responses[id].responseIndex;
                }
            }
        });

    }

    goToMember(member) {
        this.nav.push(MemberDetailPage, member);
    }

    setDirty() {
        this.dirty = true;
        console.log('dirty!');
    }

    sliderPadding(question, obj) {
        let padding = 0;
        let n = question.type.choices.length;
        if (obj) {
            let rect = obj.getBoundingClientRect();
            let width = rect.right - rect.left;
            padding = (width / n) / 2;
        }
        return padding;
    }

    save() {
        for (let i = 0; i < this.instrument.questions.length; i++) {
            let id = this.instrument.questions[i].id;
            this.assessment.responses[id].responseIndex = this.instrument.questions[i].response;
        }
        this.assessmentData.update(this.assessment, false).then(
            success => {
                this.dirty = false;
            },
            error => {
                console.log('ERR:', error);
            }
        );
    }

    lock() {
        this.assessment.locked = !this.assessment.locked;
    }

    goTo(slideIndex) {
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

    answer(question, responseIndex) {
        return question.type.choices[(responseIndex - 1)].name;
    }

    pdfText(doc, left, text, currentTop) {
        doc.text(text, left, currentTop);
        let nLines = 1;
        let rect = doc.getTextDimensions(text);
        let ht = Math.round(rect.h);
        if (typeof text !== 'string') {
            nLines = text.length;
        }
        currentTop += (ht * nLines);
        return currentTop + 1;
    }

    newPage(doc, currentTop, page) {
        currentTop = 40;
        this.putPage(doc, page);
        page++;
        return {currentTop: currentTop, page: page};
    }

    putPage(doc, page) {
        doc.setTextColor('#AAAAAA').text(360, 580, 'Page ' + page).addPage();
    }

    generatePDF(instrument, assessment) {
        let comp = this;
        let doc = this.pdf.create();
        let logo = null;
        let today = new Date();

        if (assessment && assessment.instrument) {
            this.pdf.getDataUri(this.config.logoPrint, function (dataUri) {
                logo = dataUri;
                let page = 1;
                let currentTop = 20;
                let left = 40;
                let name = assessment.member.firstName +
                    (assessment.member.middleName ? ' ' + assessment.member.middleName : '') + ' ' +
                    assessment.member.lastName;

                doc.setTextColor('#444444');
                doc.setFontStyle('bold');
                doc.addImage(logo, 'PNG', 300, currentTop);
                currentTop = 80;

                doc.setFontSize(18);
                doc.setTextColor('#004462');
                currentTop = comp.pdfText(doc, left, instrument.name, currentTop);

                doc.setTextColor('#AAAAAA');
                currentTop = comp.pdfText(doc, left, today.toLocaleDateString("en-US"), currentTop);
                currentTop = comp.pdfText(doc, left, name, currentTop);

                doc.setFontStyle('normal');
                for (let questionGroup of instrument.questionGroups) {
                    if (currentTop > 460) {
                        let info = comp.newPage(doc, currentTop, page);
                        currentTop = info.currentTop;
                        page = info.page;
                    }
                    doc.setTextColor('#999999');
                    doc.setFontSize(12);
                    currentTop = comp.pdfText(doc, left, '' + questionGroup.number + '. ' + questionGroup.tag, currentTop);
                    for (let question of questionGroup.questions) {
                        if (currentTop > 500) {
                            let info = comp.newPage(doc, currentTop, page);
                            currentTop = info.currentTop;
                            page = info.page;
                        }
                        let response = assessment.responses[question.id];
                        let num = questionGroup.number + '.' + question.number;
                        let splitText = doc.splitTextToSize(question.name, 250);
                        let answerText = comp.answer(question, response.responseIndex);
                        doc.setTextColor('#000000').setFontSize(10);
                        comp.pdfText(doc, left + 10, num, currentTop);
                        comp.pdfText(doc, left + 290, answerText, currentTop);
                        doc.setTextColor('#666666');
                        currentTop = comp.pdfText(doc, left + 30, splitText, currentTop);
                    }
                }
                if (page > 1) {
                    comp.putPage(doc, page);
                }
                doc.save('assessment.pdf');
            });
        }
        else {
            this.globals.alertError('Sorry, but this appears to be an invalid assessment.');
        }
    }

    /*****
     genAutoTablePdf(instrument, assessment) {
        let columns = ["ID", "Name", "Country"];
        let rows = [
            [1, "Shaw", "Tanzania this is\nsome really very long text that should wrap around nicely if this thing works as it shoud."],
            [2, "Nelson", "Kazakhstan this is \nsome really very long\n text that should wrap around nicely if this thing works as it shoud."],
            [3, "Garcia", "Madagascar this is some really very long text that should \nwrap around\n nicely if this thing works as it shoud."],
        ];

        let doc = this.pdf.doc;
        doc.autoTable(['', '', ''], rows, {
            styles: {
                cellPadding: 5,
                fontSize: 10,
                font: "helvetica", // helvetica, times, courier
                lineColor: 200,
                lineWidth: 1,
                fontStyle: 'normal', // normal, bold, italic, bolditalic
                overflow: 'linebreak', // visible, hidden, ellipsize or linebreak
                fillColor: false, // false for transperant or a color as described below
                textColor: 20,
                halign: 'left', // left, center, right
                valign: 'middle', // top, middle, bottom
                rowHeight: 20,
                columnWidth: 'auto' // 'auto', 'wrap' or a number
            }
        });
        doc.save('table.pdf');
    }

     generatePdfFromHtml(instrument, assessment) {
        let doc = this.pdf.doc;
        let html = '<html><body><h1>Assessment</h1><table><tbody>';
        let nGroups = instrument.questionGroups.length;
        for (let i = 0; i < nGroups; i++) {
            let questionGroup = instrument.questionGroups[i];
            html += '<tr><td>' + questionGroup.tag + '</td><td></td></tr>';
            for (let j = 0; j < questionGroup.questions.length; j++) {
                let question = questionGroup.questions[j];
                if (question) {
                    let response = assessment.responses[question.id];
                    html += '<tr><td width="80%">' + question.name + '</td><td width="20%">' + this.answer(question, response.responseIndex) + '</td></tr>';
                }
            }
        }
        html += '</tbody></table></body></html>';
        console.log(html);
        doc.fromHTML(html);
        doc.autoPrint();
        //doc.output("dataurlnewwindow"); // this opens a new popup,  after this the PDF opens the print window view but there are browser inconsistencies with how this is handled
        doc.save('assessment.pdf');
        //let assessmentFileName = 'Assessment_' + assessment.member.firstName + '_' + assessment.member.lastName + '_' + assessment.lastModified;
        //assessmentFileName = this.globals.safeName(assessmentFileName);
        //doc.save(assessmentFileName);
    }
     ****/
}
