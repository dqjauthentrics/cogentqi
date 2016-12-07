import {Component, Input} from "@angular/core";

@Component({
    selector: '<rubric [question]="question"></rubric>',
    templateUrl: 'rubric.html',
})

export class Rubric {
    @Input() question;

    cellWidth() {
        if (this.question && this.question.choices) {
            return (this.question.type.choices.length / 100) + '%';
        }
        return '20%';
    }

    setResponse(value) {
        this.question.response = value;
    }

}
